import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import Modal from "../modal";
import { styled, Tooltip } from "@mui/material";
import Image from "next/image";
import Dropdown from "../dropdown";
import ArrowDownIcon from "../../assets/img/arrow-down.svg";
import ConfirmNotification from "./ConfirmNotification";
import CustomDropdown from "../dropdown/CustomDropdown";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { UPDATE_PROJECT } from "@/graphql/mutations/project";
import { GET_USERS } from "@/graphql/queries/user";

interface NewProjectModalT {
  handleClose: () => void;
  open: boolean;
  action: "create" | "edit" | "delete" | "archive" | "unarchive" | undefined;
  selectedProject?: any;
  onComplete: () => void;
}

const NewProjectModalContent = styled("div")`
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
`;

const FormSectionHeader = styled("h3")`
  margin-top: 0rem;
  margin-bottom: 1rem;
  font-weight: 600;
  line-height: 1.5rem;
  font-size: 1rem;
`;

const DropdownContentWrapper = styled("div")`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items; center;
    font-size: 0.875rem;
    color: #02120d;
    font-weight: 500;
  
    padding: 0.6rem 0.9rem;
    gap: 8px;
  
    > span {
      display: flex;
      align-items: center;
    }
    > img {
      width: 24px;
      height: 24px;
    }
  `;

const DropdownWrapper = styled("div")`
  border: 1px solid #d0d5dd;
  border-radius: 8px;
`;

const FormDropdownInputWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
  gap: 5px;

  .label {
    color: #52625d;
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.25rem;
  }

  > div {
    display: flex;
    justify-content: space-between;
  }
  > span {
    font-size: 0.7rem;
    line-height: 1.125rem;
    font-weight: 400;
    color: #667085;
  }
`;

const FromDropdownExtraInfo = styled("div")`
  color: #244bb6;
  font-weight: 400;
  line-height: 1.25rem;
  font-size: 0.875rem;
`;

interface FormDropdownInputT {
  data: Array<string>;
  label: string;
  extraLabel: string;
  extra: string;
  extraX: string;
  placeholder: string;
}
const FormDropdownInput: React.FC<FormDropdownInputT> = ({
  data,
  label,
  extra,
  extraLabel,
  extraX,
  placeholder,
}) => {
  return (
    <FormDropdownInputWrapper>
      <div>
        <label className="label">{label}</label>
        <FromDropdownExtraInfo>
          {extraLabel} {extra}
        </FromDropdownExtraInfo>
      </div>
      <span>{extraX}</span>
      <DropdownWrapper>
        <Dropdown data={data} setValue={(x) => x}>
          <DropdownContentWrapper>
            <span>{placeholder}</span>
            <Image src={ArrowDownIcon} alt="" />
          </DropdownContentWrapper>
        </Dropdown>
      </DropdownWrapper>
    </FormDropdownInputWrapper>
  );
};

const FormWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem 0;
  overflow-y: auto;
  padding-right: 0.5rem;
  max-height: calc(80vh - 120px); /* Subtract space for header and buttons */

  /* for webkit-based browsers */
  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 5px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  ::-webkit-scrollbar-corner {
    background: #f1f1f1;
  }

  /* for Firefox */
  .scrollbar {
    width: 5px;
  }

  .scrollbar-track {
    background: #f1f1f1;
  }

  .scrollbar-thumb {
    background: #888;
    border-radius: 5px;
  }

  .scrollbar-thumb:hover {
    background: #555;
  }

  .scrollbar-corner {
    background: #f1f1f1;
  }
`;

const NewProjectModalBtn = styled("div")`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 0;
  border-top: 1px solid #eaecf0;
  background: white;
  flex-shrink: 0;

  > button {
    all: unset;
    padding: 0.5rem 0.9rem;
    border-radius: 8px;
    border: 1px solid #02120d;
    display: flex;
    justify-content: center;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    cursor: pointer;
  }

  > .primary {
    background: #50589f;
    color: #f8f9fb;
    border: 1px solid #50589f;
    font-weight: 600;
  }
`;

const AddMemberModal: React.FC<NewProjectModalT> = ({
  handleClose,
  open,
  action,
  selectedProject,
  onComplete,
}) => {
  const key = Math.random();

  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const closeConfirmModal = () => {
    handleClose();
    setOpenConfirmModal(false);
    setSuccess(undefined);
  };

  const membersId = selectedProject?.members?.map((e: any) => e?._id) || [];
  const managersId = selectedProject?.managers?.map((e: any) => e?._id) || [];
  const qaId = selectedProject?.qa?.map((e: any) => e?._id) || [];

  const [members, setMembers] = useState(membersId);
  const [managers, setManagers] = useState(managersId);
  const [qa, setQa] = useState(qaId);
  const [projectName, setProjectName] = useState(
    selectedProject?.name?.name || ""
  );
  const [confirm, setConfirm] = useState(false);
  const [success, setSuccess] = useState<"true" | "error" | null | "loading">();

  useEffect(() => {
    setProjectName(selectedProject?.name?.name);
    setManagers(managersId);
    setMembers(membersId);
    setQa(qaId);
  }, [selectedProject]);

  const [
    editProject,
    { loading: editProjectLoading, error: editProjectError },
  ] = useMutation(UPDATE_PROJECT);
  // console.log(data, "fetching user");

  const { loading, error, data } = useQuery(GET_USERS, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        status: "ACTIVE",
      },
    },
  });
  const membersData = useMemo(() => {
    return data?.getUsers?.data
      ?.filter((e: any) => e.status === 'ACTIVE')
      ?.map((e: any) => ({
        ...e,
        id: e._id,
        name: e.name ? e.name : `${e.firstName} ${e.lastName}`,
      }));
  }, [data]);

  const managersData = useMemo(() => {
    return membersData?.filter((e: any) => e.role !== "" && e.status === 'ACTIVE');
  }, [membersData]);

  // Add sorting functions to ensure selected users appear at top of dropdowns
  const sortedMembers = () => {
    if (!membersId || !membersData) return membersData || [];
    return [...membersData].sort((a: any, b: any) => {
      if (membersId.includes(a.id) && !membersId.includes(b.id)) {
        return -1;
      } else if (!membersId.includes(a.id) && membersId.includes(b.id)) {
        return 1;
      } else {
        return 0;
      }
    });
  };

  const sortedManagers = () => {
    if (!managersId || !managersData) return managersData || [];
    return [...managersData].sort((a: any, b: any) => {
      if (managersId.includes(a.id) && !managersId.includes(b.id)) {
        return -1;
      } else if (!managersId.includes(a.id) && managersId.includes(b.id)) {
        return 1;
      } else {
        return 0;
      }
    });
  };

  const sortedQA = () => {
    if (!qaId || !membersData) return membersData || [];
    return [...membersData].sort((a: any, b: any) => {
      if (qaId.includes(a.id) && !qaId.includes(b.id)) {
        return -1;
      } else if (!qaId.includes(a.id) && qaId.includes(b.id)) {
        return 1;
      } else {
        return 0;
      }
    });
  };

  const updateProject = async () => {
    setSuccess("loading");
    try {
      const updatePayload = {
        ProjectId: selectedProject?.id,
        projectName: projectName,
        projectImage: null,
        members: members,
        managers: managers,
        qa: qa,
      };
      const { data } = await editProject({
        variables: {
          input: updatePayload,
        },
      });
      setSuccess("true");
    } catch (error) {
      setSuccess("error");
    }
  };

  const clearData = () => {
    setProjectName("");
    setMembers([]);
    setManagers([]);
    setQa([]);
  };

  useEffect(() => {
    if (confirm) {
      switch (action) {
        case "edit":
          updateProject();
          break;
      }
    }
  }, [confirm]);
  return (
    <Modal
      handleClose={() => {
        handleClose();
        clearData();
        onComplete();
      }}
      open={open}
      borderRadius="15px"
      title={"Add Members"}
      width="30rem"
      height="auto"
    >
      <NewProjectModalContent>
        <ConfirmNotification
          selected={selectedProject}
          action={action}
          open={openConfirmModal}
          close={closeConfirmModal}
          handleConfirm={() => setConfirm(true)}
          success={success}
        />
        <FormWrapper>
          <FormSectionHeader>Members Settings</FormSectionHeader>
          <CustomDropdown
            data={sortedManagers()}
            extra={managers?.length || "0"}
            extraLabel="Manager"
            extraX="Oversees and manages the project"
            label="Assigned Managers"
            placeholder="Select Managers"
            value={managers}
            onChange={(e: Array<any>) => setManagers(e)}
            listWrapperStyle={{ maxHeight: "12rem" }}
          />

          <CustomDropdown
            data={sortedQA()}
            extra={qa?.length || "0"}
            extraLabel="QA"
            extraX="Quality assurance and ticket approval authority"
            label="Assigned QA Members"
            placeholder="Select QA Members"
            onChange={(e: Array<any>) => setQa(e)}
            value={qa}
            listWrapperStyle={{ maxHeight: "12rem" }}
          />

          <CustomDropdown
            data={sortedMembers()}
            extra={members?.length || "0"}
            extraLabel="Members"
            extraX="Users that contributes to this projects"
            label="Assigned Members"
            placeholder="Select Memebers"
            onChange={(e: Array<any>) => setMembers(e)}
            value={members}
            listWrapperStyle={{ maxHeight: "12rem" }}
          />
        </FormWrapper>

        <NewProjectModalBtn>
          <button
            onClick={() => {
              handleClose();
              clearData();
              onComplete();
            }}
          >
            Cancel
          </button>
          <button className="primary" onClick={() => setOpenConfirmModal(true)}>
            {action === "edit" ? "Update" : "Create"}
          </button>
        </NewProjectModalBtn>
      </NewProjectModalContent>
    </Modal>
  );
};

export default AddMemberModal;

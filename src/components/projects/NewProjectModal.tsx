import React, {
  ChangeEvent,
  DragEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import Modal from "../modal";
import { styled } from "@mui/material";
import Image from "next/image";
import ImageIcon from "../../assets/img/image.svg";
import Dropdown from "../dropdown";
import ArrowDownIcon from "../../assets/img/arrow-down.svg";
import ConfirmNotification from "./ConfirmNotification";
import CustomDropdown from "../dropdown/CustomDropdown";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { CREATE_PROJECT, UPDATE_PROJECT } from "@/graphql/mutations/project";
import { GET_USERS } from "@/graphql/queries/user";
import { awsUpload } from "@/utils/uploadMedaia";
import { useRecoilState } from "recoil";
import userAtom from "@/atoms/user-atom";
import CloseIcon from "../../assets/icons/x-close.svg";
import { notifyErrorFxn } from "@/utils/toast-fxn";

interface NewProjectModalT {
  handleClose: () => void;
  open: boolean;
  action: "create" | "edit" | "delete" | "archive" | "unarchive" | undefined;
  selectedProject?: any;
  onComplete: () => void;
  existingProjects?: Array<any>;
}

const NewProjectModalContent = styled("div")`
  // padding-top: 1rem;
  height: 50vh;
  max-height: 50vh;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: auto;
  // border: 1px solid;
  box-sizing: border-box;
`;

const FormWrapper = styled("div")`
  flex: 1;
  // overflow: auto;
  padding-right: 0.5rem;
  height: auto;

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

const InputWrapper = styled("div")`
  margin-bottom: 0.6rem;
  position: relative;
  .image-upload-container {
    width: 100%;
    height: 10rem;
    border: 1px dashed rgba(17, 25, 41, 0.2);
    border-radius: 10px;
    background: #f4f6fa;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    cursor: pointer;
  }

  .image-upload-input {
    display: none;
  }

  .image-preview {
    max-width: 100%;
    max-height: 100%;
  }

  .image-placeholder {
    text-align: center;
    color: #999;
    font-size: 16px;
  }
`;

const InputInfoWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  justify-conent: center;
  align-items: center;
  gap: 5px;

  > span:nth-of-type(1) {
    font-weight: 500;
    color: #244bb6;
    font-size: 0.876rem;
    line-height: 1.25rem;
  }

  > span:nth-of-type(2) {
    color: #52625d;
    font-size: 0.75rem;
    line-height: 1.125rem;
  }
`;

const FormSectionHeader = styled("h3")`
  margin-top: 3rem;
  margin-bottom: 1rem;
  font-weight: 600;
  line-height: 1.5rem;
  font-size: 1rem;
`;

const FormTextInputWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 1rem;
  > label {
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: #475467;
    font-weight: 500;
  }

  > input {
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: #667085;
    border: 1px solid #d0d5dd;
    padding: 10px 14px;
    border-radius: 8px;
  }
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
    line-height: 1.25rem; // setProject
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
interface FormTextInputT {
  label: string;
  placeholder: string;
  name: string;
  onChange?: (value: string) => void;
  value?: string;
}

const FormTextInput: React.FC<FormTextInputT> = ({
  label,
  placeholder,
  name,
  onChange,
  value,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(e.target.value);
  };
  return (
    <FormTextInputWrapper>
      <label htmlFor={name}>{label}</label>
      <input
        name={name}
        placeholder={placeholder}
        onChange={handleChange}
        value={value}
      />
    </FormTextInputWrapper>
  );
};
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

const NewProjectModalBtn = styled("div")`
  // margin-top: 3rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;

  > button {
    all: unset;
    padding: 0.5rem 0.9rem;
    border-radius: 8px;
    border: 1px solid #02120d;
    // min-width: 120px;
    display: flex;
    justify-content: center;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
  }

  > .primary {
    background: #50589f;
    color: #f8f9fb;
    border: 1px solid #50589f;
    font-weight: 600;
  }
`;

const NewProjectModal: React.FC<NewProjectModalT> = ({
  handleClose,
  open,
  action,
  selectedProject,
  onComplete,
  existingProjects = [],
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useRecoilState(userAtom);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const closeConfirmModal = () => {
    setConfirm(false);
    setOpenConfirmModal(false);
    onComplete();
    handleClose();
    clearData();
  };
  const [logo, setLogo] = useState<File | null>(null);

  const membersId = selectedProject?.members?.map((e: any) => e?._id);
  const managersId = selectedProject?.managers?.map((e: any) => e?._id);
  const qaId = selectedProject?.qa?.map((e: any) => e?._id);

  const [members, setMembers] = useState(membersId || []);
  const [managers, setManagers] = useState(managersId || []);
  const [qa, setQa] = useState(qaId || []);
  const [projectName, setProjectName] = useState(
    selectedProject?.name?.name || ""
  );
  const [confirm, setConfirm] = useState(false);
  const [success, setSuccess] = useState<"true" | "error" | null | "loading">();
  const [imageError, setImageError] = useState(false);
  const [projectImage, setProjectImage] = useState("");
  useEffect(() => {
    setProjectName(selectedProject?.name?.name);
    setProjectImage(selectedProject?.name?.image);
    setManagers(managersId);
    setMembers(membersId);
    setQa(qaId || []);
  }, [selectedProject]);

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 2 * 1024 * 1024) {
        setImageError(true);
      } else {
        setSelectedImage(URL.createObjectURL(file));
        setLogo(file);
      }
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 2 * 1024 * 1024) {
        setImageError(true);
      } else {
        setSelectedImage(URL.createObjectURL(file));
        setLogo(file);
      }
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleContainerClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onFileChange = async () => {
    const data = await awsUpload({
      file: logo as File,
      fileName: logo?.name as string,
      dirName: logo?.name as string,
    });
    setProjectImage(data?.location);
  };

  useEffect(() => {
    if (logo) {
      onFileChange();
    }
  }, [logo]);

  const [addProject, { loading: addProjectLoading, error: addProjectError }] =
    useMutation(CREATE_PROJECT);

  const [
    editProject,
    { loading: editProjectLoading, error: editProjectError },
  ] = useMutation(UPDATE_PROJECT);

  const { loading, error, data } = useQuery(GET_USERS, {
    variables: {
      input: {
        status: "ACTIVE",
      },
    },
    fetchPolicy: "network-only",
  });

  const membersData = data?.getUsers?.data
    ?.filter((e: any) => e.status === 'ACTIVE') // Filter for active users only
    ?.map((e: any) => ({
      ...e,
      id: e._id,
      name: e.name ? e.name : `${e.firstName} ${e.lastName}`,
    }));

  const managersData = membersData?.filter((e: any) => e.status === 'ACTIVE');

  // sort the membersData such that users in membersId comes first
  const sortedMembers = () => {
    if (!membersId) return membersData;
    if (!membersData) return [];
    return membersData.sort((a: any, b: any) => {
      if (membersId.includes(a.id) && !membersId.includes(b.id)) {
        return -1;
      } else if (!membersId.includes(a.id) && membersId.includes(b.id)) {
        return 1;
      } else {
        return 0;
      }
    });
  };

  // sort the managersData such that users in managersId comes first
  const sortedManagers = () => {
    if (!managersId) return membersData;
    if (!membersData) return [];
    return managersData.sort((a: any, b: any) => {
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
    if (!qaId) return membersData;
    if (!membersData) return [];
    return membersData.sort((a: any, b: any) => {
      if (qaId.includes(a.id) && !qaId.includes(b.id)) {
        return -1;
      } else if (!qaId.includes(a.id) && qaId.includes(b.id)) {
        return 1;
      } else {
        return 0;
      }
    });
  };

  const createProject = async () => {
    setSuccess("loading");
    if (!projectName) {
      setSuccess("error");
    } else {
      // Check for duplicate project name
      const isDuplicate = existingProjects?.some(
        (project: any) =>
          project?.name?.name?.toLowerCase() === projectName?.toLowerCase()
      );

      if (isDuplicate) {
        notifyErrorFxn("A project with this name already exists");
        setSuccess("error");
        return;
      }

      try {
        const { data } = await addProject({
          variables: {
            input: {
              projectName: projectName,
              projectImage: projectImage || selectedImage,
              members: members,
              managers: managers,
              qa: qa,
              organization: user?.userData?.attachedOrganization?._id,
            },
          },
        });

        setSuccess("true");
      } catch (error) {
        setSuccess("error");
      }
    }
  };

  const updateProject = async () => {
    setSuccess("loading");
    if (!projectName) {
      setSuccess("error");
    } else {
      try {
        const { data } = await editProject({
          variables: {
            input: {
              ProjectId: selectedProject?.id,
              projectName: projectName,
              projectImage: projectImage || selectedImage,
              members: members,
              managers: managers,
              qa: qa,
            },
          },
        });

        setSuccess("true");
      } catch (error) {
        setSuccess("error");
      }
    }
  };

  const clearData = () => {
    setProjectName("");
    setMembers([]);
    setManagers([]);
    setQa([]);
    setLogo(null);
    setProjectImage("");
    setSelectedImage(null);
  };

  useEffect(() => {
    if (confirm) {
      switch (action) {
        case "create":
          createProject();
          break;
        case "edit":
          updateProject();
          break;
      }
    }
  }, [confirm]);

  return (
    <Modal
      handleClose={() => {
        setConfirm(false);
        handleClose();
        clearData();
        onComplete();
      }}
      open={open}
      borderRadius="15px"
      title={action === "edit" ? "Edit Project" : "New Project"}
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
          <InputWrapper>
            <>
              {selectedImage ? (
                <div
                  onClick={() => {
                    setImageError(false);
                    setSelectedImage(null);
                  }}
                  style={{
                    background: "#EAECF0",
                    borderRadius: "10px",
                    alignItems: "center",
                    display: "flex",
                    width: "3rem",
                    justifyContent: "center",
                    position: "absolute",
                    top: "30%",
                    cursor: "pointer",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 1,
                    height: "3rem",
                  }}
                >
                  <Image src={CloseIcon} width={20} height={20} alt=" " />
                </div>
              ) : projectImage ? (
                <div
                  onClick={() => {
                    setProjectImage("");
                    setImageError(false);
                  }}
                  style={{
                    background: "#EAECF0",
                    borderRadius: "10px",
                    alignItems: "center",
                    display: "flex",
                    width: "3rem",
                    justifyContent: "center",
                    position: "absolute",
                    top: "30%",
                    cursor: "pointer",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 1,
                    height: "3rem",
                  }}
                >
                  <Image src={CloseIcon} width={20} height={20} alt=" " />
                </div>
              ) : (
                ""
              )}
            </>
          </InputWrapper>
          {/* <FormSectionHeader>General Settings</FormSectionHeader> */}
          <FormTextInput
            name="project-name"
            placeholder="Add name for project"
            label="Project Name"
            onChange={(e: string) => setProjectName(e)}
            value={projectName}
          />
          <CustomDropdown
            data={sortedManagers()}
            extra={managers?.length || "0"}
            extraLabel="Manager"
            extraX="Oversees and manages the project"
            label="Assigned Managers"
            placeholder="Select Managers"
            value={managers}
            onChange={(e: Array<any>) => setManagers(e)}
            listWrapperStyle={{ maxHeight: "28rem" }}
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
            listWrapperStyle={{ maxHeight: "28rem" }}
          />
          <CustomDropdown
            data={sortedMembers()}
            extra={members?.length || "0"}
            extraLabel="Members"
            extraX="Users that contributes to this projects"
            label="Assigned Members"
            placeholder="Select Members"
            onChange={(e: Array<any>) => setMembers(e)}
            value={members}
            listWrapperStyle={{ maxHeight: "28rem" }}
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
            {action === "edit" ? "Update Project" : "Create Project"}
          </button>
        </NewProjectModalBtn>
      </NewProjectModalContent>
    </Modal>
  );
};

export default NewProjectModal;

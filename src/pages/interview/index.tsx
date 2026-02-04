import { FC, useState } from "react";
import { useFormik } from "formik";
import { useInterviewSettings } from "@/hooks/interview-settings";
import { ClipLoader } from "react-spinners";
import QuestionsPerCategory from "@/components/QuestionsPerCategory";
import QuestionsDelay from "@/components/QuestionsDelay";
import CustomDropdownInterview from "./interviewCustomDropDown";
import { ToastContainer } from "react-toastify";

const InterviewSettings: FC = () => {
  const [selectedValueCategory, setSelectedValueCategory] =
    useState<string>("");
  const [selectedValue, setSelectedValue] = useState<string>("");

  const questionsPerCategoryOptions = [
    { value: "", label: "Select option" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
  ];
  const questionsDelayOptions = [
    { value: "", label: "Select option" },
    { value: "0", label: "No Delay" },
    { value: "1", label: "1 second" },
    { value: "2", label: "2 seconds" },
    { value: "3", label: "3 seconds" },
    { value: "4", label: "4 seconds" },
    { value: "5", label: "5 seconds" },
  ];

  const handleSelect = (value: string) => {
    setSelectedValue(value);
  };
  const handleSelectCategory = (value: string) => {
    setSelectedValueCategory(value);
  };

  const { interviewSettings, updateInterviewSettings, loading } =
    useInterviewSettings({});

  const formik = useFormik({
    initialValues: {
      questionsPerCategory: interviewSettings.questionsPerCategory || "", // Allow string or empty value
      questionDelay: +interviewSettings.questionDelay,
      showStatistics: interviewSettings.showStatistics ? "true" : "false",
      followOnQuestions: interviewSettings.followOnQuestions,
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      const updates = {
        questionsPerCategory: +values.questionsPerCategory,
        questionDelay: +values.questionDelay,
        showStatistics: values.showStatistics == "true" ? true : false,
        followOnQuestions: values.followOnQuestions,
      };
      updateInterviewSettings(updates);
    },
  });

  const handleDropdownSelect = (value: string) => {
    formik.setFieldValue("questionsPerCategory", value);
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      className='interview-settings-container'
    >
      <ToastContainer />
      <div className='interview-settings'>
        <h2 className='mt-[1.302vw] ml-[1.302vw] text-[#282833] text-[1.25vw] font-semibold leading-[1.625vw] text-left gap-0'>
          Interview Settings
        </h2>

        <p className='ml-[1.38vw] mt-[0.417vw] text-[#667085]  text-[0.833vw] gap-0 font-normal leading-[1.083vw] text-left font-switzer'>
          We may still send you important notifications about your account
          outside of your notification settings.
        </p>

        <hr className='line'></hr>
        <div className='h-[70vh] '>
        <div className="setting">
          <label className="h-[1.354vw] font-semibold  text-[1.042vw] mt-[2vw] ml-[1.5vw] leading-[1.354vw] text-[#282833] ">
            Follow on Questions
          </label>

          <p className="w-[20.156vw] h-[3.281vw] mt-[0.35vw] gap-0  font-normal text-[0.833vw] leading-[1.083vw] text-left text-[#6F6F76] ml-[1.5vw]">
            Follow-up questions are AI Based additional questions that build upon or explore further the response to an initial question.
          </p>
          <label className="text-[0.938vw] font-medium leading-[1.125vw] text-left text-[#282833] ml-[34.4vw] -mt-[4.75vw] ">
            <input
              type="checkbox"
              name="followOnQuestions"
              value={`${formik.values.followOnQuestions}`}
              checked={formik.values.followOnQuestions}
              onChange={formik.handleChange}
            />
            Enable Follow on Questions
          </label>
        </div>
        <hr className="mt-[4.75vw]"></hr>
        <div className="setting flex">
          <div>
          <label className="h-[1.354vw] font-semibold text-[1.042vw] mt-[2vw] leading-[1.354vw] text-[#282833] ml-[1.5vw]">
            Questions per Category
          </label>
          <p className="w-[20.156vw] h-[3.281vw] mt-[0.35vw]  text-[0.833vw] gap-0 font-normal leading-[1.083vw] text-left text-[#6F6F76] ml-[1.5vw]">
            This will ensure the number of Questions that are displayed in a Category.
          </p>
          </div>
          <div className="ml-[12.8vw] mt-[2vw]">
          <CustomDropdownInterview
          name='questionsPerCategory'
          options={questionsPerCategoryOptions}
          selectedValue={formik.values.questionsPerCategory}
          onSelect={value => formik.setFieldValue('questionsPerCategory', value)}
          className='mx-auto md:flex-row md:justify-center rounded-[0.781vw] w-[9.948vw]'

          />
            {/* <select

              name="questionsPerCategory"
              className=" custom-select border border-gray-300 rounded-[0.781vw] w-[9.948vw]  mr-[30.8vw] h-[2.552vw] px-[0.5vw] text-[#8C8C8C]  text-[0.833vw] -mt-[4.75vw] flex mx-auto md:flex-row md:justify-center"
              value={formik.values.questionsPerCategory}
              onChange={formik.handleChange}
            >
              <option value="" >Select option</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select> */}
            </div>
          </div>
        <hr className="mt-[2.5vw]"></hr>
        <div className="setting flex">
         <div>
            
              <label className="h-[1.354vw] font-semibold text-[1.042vw] mt-[2vw] leading-[1.354vw] text-[#282833] ml-[1.5vw]">

                Set Question Delay
              </label>
              <p className='w-[20.156vw] h-[3.281vw] mt-[0.35vw]  text-[0.833vw] gap-0 font-normal leading-[1.083vw] text-left text-[#6F6F76] ml-[1.5vw]'>
                This will set a delay between Question that are spoken by the
                Interviewer once a Question ends.
              </p>

         </div>
          <div className="ml-[12.8vw] mt-[2vw]">

              <CustomDropdownInterview
                name='questionDelay'
                options={questionsPerCategoryOptions}
                selectedValue={formik.values.questionDelay}
                onSelect={(value) =>
                  formik.setFieldValue("questionDelay", value)
                }
                className='mx-auto md:flex-row md:justify-center rounded-[0.781vw] w-[9.948vw]'
              />

              {/* <select
              name="questionDelay"
              className="border border-gray-300 rounded-[0.781vw] w-[9.948vw] bg-white mr-[30.8vw] h-[2.552vw] px-[0.5vw] text-[#8C8C8C] text-[0.833vw] -mt-[4.75vw] flex mx-auto md:flex-row md:justify-center"
              value={formik.values.questionDelay}
              onChange={formik.handleChange}
            >
              <option value="" >Select option</option>
              <option value="0">No Delay</option>
              <option value="1">1 second</option>
              <option value="2">2 seconds</option>
              <option value="3">3 seconds</option>
              <option value="4">4 seconds</option>
              <option value="5">5 seconds</option>

            </select> */}
            </div>
          </div>
          <div className='setting'>
            <hr className='mt-[2.5vw]' />
            <label className='h-[1.354vw] font-semibold text-[1.042vw] mt-[2vw] leading-[1.354vw] text-[#282833] ml-[1.5vw]'>
              Show Interview Statistics
            </label>
            <p className='w-[20.156vw] h-[3.281vw] mt-[0.35vw] text-[0.833vw] gap-0  font-normal leading-[1.083vw] text-left text-[#6F6F76] ml-[1.5vw]'>
              This will show the Interview Statistics once the Interview is
              conducted.
            </p>
            <div>
              <div className='yesno -mt-[2.9vw] ml-[3vw] flex justify-center items-center space-x-8'>
                <label className='yes flex items-center text-[0.833vw]'>
                  <input
                    type='radio'
                    name='showStatistics'
                    value={"true"}
                    checked={formik.values.showStatistics === "true"}
                    onChange={formik.handleChange}
                  />
                  Yes
                </label>
                <label className='no flex items-center text-[0.833vw]'>
                  <input
                    type='radio'
                    name='showStatistics'
                    value={"false"}
                    checked={formik.values.showStatistics === "false"}
                    onChange={formik.handleChange}
                  />
                  No
                </label>
              </div>{" "}
            </div>
          </div>
          <div className='mt-[1.5vw] ml-[0.25vw] p-6 flex justify-start text-[0.938vw]'>
            <button
              type='submit'
              className='save-button text-white text-[0.938vw] min-h-[2vw] w-[10vw] rounded-[0.781vw] mx-0 px-4 py-2 hover:bg-[#3C448B]'
            >
              {loading ? (
                <ClipLoader size={18} color='#ffff' />
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default InterviewSettings;

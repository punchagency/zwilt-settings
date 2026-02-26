import React, { useState } from "react";
import styled from "@emotion/styled";
import Modal from "./index";
import { CircularProgress } from "@mui/material";
import { notifyErrorFxn, notifySuccessFxn } from "@/utils/toast-fxn";
import useChangePassword from "@/hooks/auth/use-change-password";
import { useRecoilState } from "recoil";
import userAtom from "@/atoms/user-atom";
interface ChangePasswordModalProps {
  open: boolean;
  handleClose: () => void;
}
const ChangePasswordModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;
const FormFieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  label {
    font-family: inter;
    font-size: 0.875rem;
    font-weight: 500;
    color: #02120d;
  }
  
  input {
    padding: 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    font-family: inter;
    font-size: 0.875rem;
    transition: border-color 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }
    
    &.error {
      border-color: #ef4444;
    }
  }
  
  .error-text {
    color: #ef4444;
    font-size: 0.75rem;
    font-family: inter;
  }
`;
const ButtonWrapper = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
  
  button {
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-family: inter;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    
    &.first-btn {
      background: #f3f4f6;
      color: #374151;
      
      &:hover {
        background: #e5e7eb;
      }
    }
    
    &.second-btn {
      background: #6366f1;
      color: white;
      
      &:hover:not(:disabled) {
        background: #4f46e5;
      }
      
      &:disabled {
        background: #9ca3af;
        cursor: not-allowed;
      }
    }
  }
`;
const PasswordStrengthIndicator = styled.div`
  margin-top: 0.25rem;
  
  .strength-bar {
    height: 4px;
    background: #e5e7eb;
    border-radius: 2px;
    overflow: hidden;
    
    .strength-fill {
      height: 100%;
      transition: width 0.3s ease, background-color 0.3s ease;
      
      &.weak {
        background: #ef4444;
        width: 25%;
      }
      
      &.fair {
        background: #f59e0b;
        width: 50%;
      }
      
      &.good {
        background: #10b981;
        width: 75%;
      }
      
      &.strong {
        background: #059669;
        width: 100%;
      }
    }
  }
  
  .strength-text {
    font-size: 0.75rem;
    font-family: inter;
    margin-top: 0.25rem;
    
    &.weak { color: #ef4444; }
    &.fair { color: #f59e0b; }
    &.good { color: #10b981; }
    &.strong { color: #059669; }
  }
`;
const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  open,
  handleClose,
}) => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [user] = useRecoilState(userAtom);
  const { changePassword } = useChangePassword();
  const [isLoading, setIsLoading] = useState(false);
  const validatePassword = (password: string) => {
    if (password.length < 8) return "Password must be at least 8 characters long";
    if (!/(?=.*[a-z])/.test(password)) return "Password must contain at least one lowercase letter";
    if (!/(?=.*[A-Z])/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/(?=.*\d)/.test(password)) return "Password must contain at least one number";
    if (!/(?=.*[@$!%*?&])/.test(password)) return "Password must contain at least one special character";
    return "";
  };
  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: "", percentage: 0 };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/(?=.*[a-z])/.test(password)) score++;
    if (/(?=.*[A-Z])/.test(password)) score++;
    if (/(?=.*\d)/.test(password)) score++;
    if (/(?=.*[@$!%*?&])/.test(password)) score++;
    
    if (score <= 2) return { strength: "weak", percentage: 25 };
    if (score === 3) return { strength: "fair", percentage: 50 };
    if (score === 4) return { strength: "good", percentage: 75 };
    return { strength: "strong", percentage: 100 };
  };
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };
  const validateForm = () => {
    const newErrors = {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
    if (!formData.oldPassword) {
      newErrors.oldPassword = "Current password is required";
    }
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else {
      const passwordError = validatePassword(formData.newPassword);
      if (passwordError) {
        newErrors.newPassword = passwordError;
      }
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (formData.oldPassword === formData.newPassword) {
      newErrors.newPassword = "New password must be different from current password";
    }
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    if (!user?.userData?._id) {
      notifyErrorFxn("User information not available");
      return;
    }
    setIsLoading(true);
    
    try {
      const result = await changePassword(
        formData.oldPassword,
        formData.newPassword,
        user.userData._id
      );
      if (result?.changePassword) {
        notifySuccessFxn("Password changed successfully!");
        handleClose();
        setFormData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setErrors({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        notifyErrorFxn("Failed to change password. Please check your current password.");
      }
    } catch (error: any) {
      notifyErrorFxn(error?.message || "An error occurred while changing password");
    } finally {
      setIsLoading(false);
    }
  };
  const handleCloseModal = () => {
    setFormData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    handleClose();
  };
  const passwordStrength = getPasswordStrength(formData.newPassword);
  return (
    <Modal
      open={open}
      handleClose={handleCloseModal}
      title="Change Password"
      width="480px"
      borderRadius="15px"
    >
      <ChangePasswordModalWrapper>
        <FormFieldWrapper>
          <label>Current Password *</label>
          <input
            type="password"
            value={formData.oldPassword}
            onChange={(e) => handleInputChange("oldPassword", e.target.value)}
            className={errors.oldPassword ? "error" : ""}
            placeholder="Enter your current password"
          />
          {errors.oldPassword && (
            <div className="error-text">{errors.oldPassword}</div>
          )}
        </FormFieldWrapper>
        <FormFieldWrapper>
          <label>New Password *</label>
          <input
            type="password"
            value={formData.newPassword}
            onChange={(e) => handleInputChange("newPassword", e.target.value)}
            className={errors.newPassword ? "error" : ""}
            placeholder="Enter your new password"
          />
          {errors.newPassword && (
            <div className="error-text">{errors.newPassword}</div>
          )}
          {formData.newPassword && !errors.newPassword && (
            <PasswordStrengthIndicator>
              <div className="strength-bar">
                <div className={`strength-fill ${passwordStrength.strength}`} />
              </div>
              <div className={`strength-text ${passwordStrength.strength}`}>
                Password strength: {passwordStrength.strength}
              </div>
            </PasswordStrengthIndicator>
          )}
        </FormFieldWrapper>
        <FormFieldWrapper>
          <label>Confirm New Password *</label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            className={errors.confirmPassword ? "error" : ""}
            placeholder="Confirm your new password"
          />
          {errors.confirmPassword && (
            <div className="error-text">{errors.confirmPassword}</div>
          )}
        </FormFieldWrapper>
        <ButtonWrapper>
          <button
            className="first-btn"
            onClick={handleCloseModal}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="second-btn"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              "Change Password"
            )}
          </button>
        </ButtonWrapper>
      </ChangePasswordModalWrapper>
    </Modal>
  );
};
export default ChangePasswordModal;
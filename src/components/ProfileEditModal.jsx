import { useState } from "react";
import { X, Save, User, Mail, Lock } from "lucide-react";
import { updateProfile } from "../services/userService";
import { useUser } from "../context/UserContext";
import "./ProfileEditModal.css";

const ProfileEditModal = ({ onClose, onSuccess }) => {
  const { user, setUser } = useUser();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) return setError("Name is required");
    if (!formData.email.trim()) return setError("Email is required");
    if (formData.password && formData.password !== formData.confirmPassword)
      return setError("Passwords do not match");
    if (formData.password && formData.password.length < 6)
      return setError("Password must be at least 6 characters");

    try {
      setLoading(true);

      const updateData = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.password) updateData.password = formData.password;

      const response = await updateProfile(updateData);

      if (response.success) {
        setUser(response.user);
        onSuccess?.();
        onClose();
      } else {
        setError(response.message || "Failed to update profile");
      }
    } catch (err) {
      setError(err.message || "An error occurred while updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">

        <div className="modal-header">
          <h2 className="modal-title">
            <User size={22} className="title-icon" />
            Edit Profile
          </h2>

          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">

          {error && <div className="error-box">{error}</div>}

          <div className="field">
            <label className="label">
              <User size={16} className="label-icon" />
              Name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              className="input"
              required
            />
          </div>

          <div className="field">
            <label className="label">
              <Mail size={16} className="label-icon" />
              Email
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              className="input"
              required
            />
          </div>

          <div className="field">
            <label className="label">
              <Lock size={16} className="label-icon" />
              New Password (optional)
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
              className="input"
            />
          </div>

          {formData.password && (
            <div className="field">
              <label className="label">
                <Lock size={16} className="label-icon" />
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className="input"
              />
            </div>
          )}

          <div className="button-row">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>

            <button disabled={loading} type="submit" className="save-btn">
              {loading ? (
                <div className="loader"></div>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;

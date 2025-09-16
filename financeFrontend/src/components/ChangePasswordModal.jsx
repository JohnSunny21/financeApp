import { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import userService from "../services/userService";

const ChangePasswordModal = ({ show, handleClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmNewPassword) {
      setError("New Passwords do not match.");
      return;
    }

    const passwordData = { currentPassword, newPassword, confirmNewPassword };

    try {
      const response = await userService.changePassword(passwordData);
      setSuccess(response.data);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      // Optionally close the modal after a delay
      setTimeout(handleClose, 2000);
    } catch (err) {
      setError(err.response?.data || " An unexpected error occurred.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Change Your Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Current Password</Form.Label>
            <Form.Control
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
          </Form.Group>
        </Form>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Update Password
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  );
};

export default ChangePasswordModal;

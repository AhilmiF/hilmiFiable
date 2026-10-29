const ConfirmModal = ({ isOpen, message = "Yakin hapus data?", onConfirm, onCancel }) => {
  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-icon">!</div>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button className="modal-btn modal-btn--confirm" onClick={onConfirm}>Ya</button>
          <button className="modal-btn modal-btn--cancel" onClick={onCancel}>Batal</button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal

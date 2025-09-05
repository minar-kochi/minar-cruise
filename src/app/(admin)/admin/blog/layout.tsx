export default function layout({
  children,
  modal,
}: {
  children: string;
  modal: string;
}) {
  return (
    <div>
      {children}
      {modal}
      <div id="modal-root" />
    </div>
  );
}

import { TruncateTable } from "./TruncateTable";
import { ConfirmDelete } from "./ConfirmDelete";

export async function ClearDb() {
  try {
    const confirmDelete = await ConfirmDelete({
      message: "Are you Sure to Delete the table ?",
    });
    if (!confirmDelete) {
      process.exit();
    }
    await TruncateTable();
    return true;
  } catch (e) {
    console.error("Unable to prompt", e);
    return false;
  }
}

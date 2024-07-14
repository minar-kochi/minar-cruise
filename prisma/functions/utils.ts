import { TruncateTable } from "./TruncateTable";
import { ConfirmDelete } from "./ConfirmDelete";


export async function ClearDb() {
  try {

    const confirmDelete = await ConfirmDelete({
      message: "Are you Sure to truncate the table ?",
    });
    if (!confirmDelete) {
      process.exit();
    }
    const truncate = await TruncateTable();

    return true;
  } catch (e) {
    console.error("Unable to prompt", e);
    return false;
  }
}

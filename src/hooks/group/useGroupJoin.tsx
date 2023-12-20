import { client } from "../../client";
import useSelfStudent from "../student/useSelfStudent";

export default function useGroupJoin(group_id: number) {
  const { student } = useSelfStudent();

  const handleGroupJoin = async () => {
    try {
      console.log("handleGroupJoin");
      const response = await client
        .from("group_members")
        .insert({
          student_id: student!.id,
          group_id: group_id,
          creator: false,
          is_admin: false,
          approved: false,
          profile_id: student!.profile_id + "",
        });

      if (response.status === 201) {
        console.log(response.data);
        // Optionally, you can return some feedback to the caller
        return { success: true, message: "Successfully joined the group." };
      } else {
        console.log("Error joining group:", response.error);
        // Optionally, you can return some feedback to the caller
        return { success: false, message: "Failed to join the group." };
      }
    } catch (error) {
      console.error("Error joining group:", error);
      // Optionally, you can return some feedback to the caller
      return { success: false, message: "An unexpected error occurred." };
    }
  };

  return {
    handleGroupJoin,
  };
}

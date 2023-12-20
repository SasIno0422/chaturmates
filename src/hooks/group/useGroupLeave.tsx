import { client } from "../../client";
import useSelfStudent from "../student/useSelfStudent";

export default function useGroupLeave(group_id: number) {
    const { student } = useSelfStudent();

    const handleGroupLeave = async () => {
        try {
            console.log("handleGroupLeave");

            // Make an API call to leave the group
            const response = await client
                .from("group_members")
                .delete()
                .eq("student_id", student!.id)
                .eq("group_id", group_id)
                .single();

            if (response.status === 200) {
                console.log(response.data);
                // Successfully left the group, return a success message
                return { success: true, message: "Successfully left the group." };
            } else {
                console.log("Unexpected response status when leaving group:", response.status);
                console.log("Error message:", response.error); // Log the error message if available
                // Optionally, you can return some feedback to the caller
                return { success: false, message: "Failed to leave the group." };
            }
        } catch (error) {
            console.error("Error leaving group:", error);
            // Optionally, you can return some feedback to the caller
            return { success: false, message: "An unexpected error occurred." };
        }
    };

    return {
        handleGroupLeave,
    };
}

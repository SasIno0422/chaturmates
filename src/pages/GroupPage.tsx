import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCol,
  IonContent,
  IonFabButton,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPage,
  IonProgressBar,
  IonRow,
  IonText,
  IonToolbar,
  useIonLoading,
  useIonRouter,
} from "@ionic/react";
import "./Group.css";
import { chevronBack, peopleCircleOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import GroupMembers from "../components/Group/GroupMembers";
import useSelfStudent from "../hooks/student/useSelfStudent";
import { useQuery } from "@tanstack/react-query";
import { getGroupByVanityUrl } from "../services/group";
import useGroupJoin from '../hooks/group/useGroupJoin';
import useGroupLeave from '../hooks/group/useGroupLeave';

export default function GroupPage() {
  const rt = useIonRouter();
  const [show, close] = useIonLoading();
  const { student } = useSelfStudent();
  const { vanity_id } = useParams<{ vanity_id: string }>();


  const query = useQuery({
    queryKey: ["group", vanity_id],
    queryFn: async () => {
      const res = (await getGroupByVanityUrl(vanity_id)).data;
      return res;
    },
    enabled: !!vanity_id,
  });

  console.log("groupMembers: ", query.data?.members);
  console.log("admins", query.data?.admins);

  const [join, setJoin] = useState(true);
  const { handleGroupJoin } = useGroupJoin(query.data?.group.id || 0);
  const { handleGroupLeave } = useGroupLeave(query.data?.group.id || 0);


  useEffect(() => {
    const stud = query.data?.members?.all.find(
      (member) => member.student_id === student?.id
    );
    setJoin(!!stud); // Set join to true if the student is found, otherwise false
  }, [query.data?.members, student?.id]);

  const handleBack = () => {
    if (rt.canGoBack()) {
      rt.goBack();
    }
    rt.push("/discover", "back");
  };

  const joinGroup = async () => {
    try {
      // Call your API to join the group
      const joinResult = await handleGroupJoin();

      // Check the result and update the local state
      if (joinResult.success) {
        setJoin(true);
        // Optionally, you can show a success notification
        console.log(joinResult.message);
      } else {
        // Optionally, you can show an error notification
        console.error('Error joining group:', joinResult.message);
      }
    } catch (error) {
      console.error('Error joining group:', error);
      // Handle error, show a notification, etc.
    }
  };

  const leaveGroup = async () => {
    try {
      if (!query.data) {
        // Handle the case where query.data is undefined
        console.error('Error leaving group: Query data is undefined');
        // Optionally, show an error notification or perform other actions
        return;
      }

      // Call your API to leave the group
      const leaveResult = await handleGroupLeave();

      // Check the result and update the local state
      if (leaveResult.success) {
        setJoin(false);
        // Optionally, you can show a success notification
        console.log(leaveResult.message);
      } else {
        // Log the entire leaveResult object for debugging
        console.error('Error leaving group:', leaveResult);
        // Optionally, you can show an error notification
        console.error('Error leaving group:', leaveResult.message);
      }
    } catch (error) {
      console.error('Error leaving group:', error);
      // Handle error, show a notification, etc.
    }
  };

  const toggleJoin = () => {
    if (join) {
      leaveGroup();
    } else {
      joinGroup();
    }
  };
  return (
    <IonPage>
      <IonContent fullscreen className="groupPage">
        <IonCard className="groupPageCard">
          {!query.data && <IonProgressBar type="indeterminate" />}
          {
            <IonFabButton
              size="small"
              className="ml-3 mt-3 mb-[-70px]"
              onClick={handleBack}
            >
              <IonIcon src={chevronBack}></IonIcon>
            </IonFabButton>
          }
          <IonGrid>
            <IonRow className="ion-justify-content-center ion-padding">
              {query.data?.group?.avatar_url ? (
                <IonCol size="4">
                  <img
                    className="groupPageLogo rounded-full"
                    src={query.data?.group?.avatar_url}
                  />
                </IonCol>
              ) : (
                <IonIcon
                  className="groupPageIcon"
                  src={peopleCircleOutline}
                ></IonIcon>
              )}
            </IonRow>
            <IonText className=" font-poppins text-center font-light text-lg">
              <p className="pageTitle">{query.data?.group?.name}</p>
              <p>Regular</p>
            </IonText>
            {query.data && (
              <IonRow className="ion-justify-content-center ion-margin-vertical">
                {join === false ? (
                  <>
                    <IonButton
                      className="ion-margin-horizontal font-poppins"
                      shape="round"
                      size="small"
                      color="success"
                      onClick={toggleJoin}
                    >
                      <IonText>Join</IonText>
                    </IonButton>
                  </>
                ) : (
                  <>
                    <IonButton
                      className="ion-margin-horizontal font-poppins"
                      shape="round"
                      size="small"
                      color="danger"
                      onClick={toggleJoin}
                    >
                      <IonText>Leave</IonText>
                    </IonButton>
                  </>
                )}
                <IonButton
                  disabled
                  className="ion-margin-horizontal font-poppins"
                  shape="round"
                  size="small"
                >
                  <IonText>Message</IonText>
                </IonButton>
              </IonRow>
            )}
            <IonText className="text-center ion-margin-vertical font-medium font-poppins">
              <p style={{ textAlign: "center" }} className="px-2">
                {query.data?.group?.description}
              </p>
            </IonText>
            <GroupMembers members={query.data?.students.all!} />
          </IonGrid>
        </IonCard>
      </IonContent>
    </IonPage>
  );
}

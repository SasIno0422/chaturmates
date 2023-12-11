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
  IonRow,
  IonText,
  IonToolbar,
  useIonLoading,
  useIonRouter,
} from "@ionic/react";
import {
  chevronBack,
  peopleCircleOutline,
  personCircleOutline,
} from "ionicons/icons";
import { GROUPS } from "../constants/groups";
import "./StudentPage.css";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { getStudentById } from "../services/student";
import GroupsResults from "../components/Discover/GroupsResults";

export default function StudentPage() {
  const rt = useIonRouter();
  const [show, close] = useIonLoading();
  const [follow, setFollow] = useState(false);

  const toggleFollow = () => {
    setFollow(!follow);
  };

  const { student_id } = useParams<{ student_id: string }>();
  const query = useQuery({
    queryKey: ["student", student_id],
    queryFn: async () => {
      console.log("useQuery");
      await show();
      const res = await getStudentById(student_id);
      await close();
      console.log("data", res.data);
      return res.data;
    },
    enabled: !!student_id,
  });

  const handleBack = () => {
    if (rt.canGoBack()) {
      rt.goBack();
    }
    rt.push("/discover", "back");
  };


  return (
    <IonPage>
      <IonContent className="studentPage">
        <IonCard className="studentPageCard ion-padding">
          {rt.canGoBack() && <IonFabButton
            size="small"
            className="mb-[-50px]"
            onClick={handleBack}
          >
            <IonIcon src={chevronBack}></IonIcon>
          </IonFabButton>}
          <IonGrid>
            <IonRow className="ion-justify-content-center">
              {query.data?.student?.avatar_url ? (
                <IonCol size="4">
                  <img
                    className="studentPageLogo"
                    src={query.data?.student.avatar_url}
                  />
                </IonCol>
              ) : (
                <IonIcon
                  className="studentPageIcon"
                  src={peopleCircleOutline}
                />
              )}
            </IonRow>
            <IonText className="text-center font-poppins font-light text-lg">
              <p className="pageTitle">{query.data?.student?.full_name}</p>
              <p>Regular</p>
            </IonText>
            <IonRow className="ion-justify-content-center ion-margin-vertical">
              <IonButton
                disabled
                shape="round"
                size="small"
                className="ion-margin-horizontal font-poppins"
              >
                Message
              </IonButton>
              {follow === false ? (
                <>
                  <IonButton
                    shape="round"
                    size="small"
                    className="ion-margin-horizontal font-poppins"
                    onClick={toggleFollow}
                  >
                    Follow
                  </IonButton>
                </>
              ) : (
                <>
                  <IonButton
                    color="success"
                    shape="round"
                    size="small"
                    className="ion-margin-horizontal font-poppins"
                    onClick={toggleFollow}
                  >
                    Followed
                  </IonButton>
                </>
              )}
            </IonRow>
            <IonText className="studentDescription  ion-margin-vertical  font-poppins font-medium">
              <p style={{ textAlign: "center" }}>
                {query.data?.student?.description}
              </p>
            </IonText>
            <GroupsResults groups={query.data?.groups} />
          </IonGrid>
        </IonCard>
      </IonContent>
    </IonPage>
  );
}

StudentPage.defaultProps = {
  slug: "johnna_doe",
  icon: personCircleOutline,
  logo: "/johnna_doe.png",
  studentName: "Johnna Doe",
  studentDescription:
    "I'm Johnna Doe, and I'm passionate about soaking up knowledge like a sponge. \n\nYou'll usually find me buried in my books, diving into subjects that fascinate me. \n\nI take pride in my commitment to learning and strive for excellence in everything I do.",
  studentType: "Regular",
  groups: [
    {
      name: GROUPS.SOFTWARE_ENGINEERING_THE_BEST.groupName,
      icon: GROUPS.SOFTWARE_ENGINEERING_THE_BEST.icon,
    },
    {
      name: GROUPS.GROUP_NI_JAY.groupName,
      icon: GROUPS.GROUP_NI_JAY.icon,
    },
    {
      name: GROUPS.POTATO_CORNER.groupName,
      icon: GROUPS.POTATO_CORNER.icon,
    },
    {
      name: GROUPS.BURGER_KING.groupName,
      icon: GROUPS.BURGER_KING.icon,
    },
    {
      name: GROUPS.JOLLIBEE.groupName,
      icon: GROUPS.JOLLIBEE.icon,
    },
  ],
};

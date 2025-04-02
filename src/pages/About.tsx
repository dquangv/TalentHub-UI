import FadeInWhenVisible from "@/components/animations/FadeInWhenVisible";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Users, Shield, Award, Heart } from "lucide-react";

const splitIntoClusters = (description, clusters) => {
  let result = [];
  let remainingText = description;

  clusters.forEach((cluster) => {
    const index = remainingText.indexOf(cluster);
    if (index !== -1) {
      if (index > 0) {
        result.push(remainingText.substring(0, index));
      }
      result.push(cluster);
      remainingText = remainingText.substring(index + cluster.length);
    }
  });

  if (remainingText) {
    result.push(remainingText);
  }

  return result;
};

const About = () => {
  const { t } = useLanguage();
  const values = [
    {
      title: t("Quality"),
      description: t("Committedtoprovidingqualityserviceandensuringsatisfaction"),
      icon: <Award className="w-6 h-6 text-primary" />,
    },
    {
      title: t("Trust"),
      description: t("Buildatrustworthyandtransparentworkingenvironment"),
      icon: <Shield className="w-6 h-6 text-primary" />,
    },
    {
      title: t("Community"),
      description: t("Createaprofessionalanddynamicfreelancercommunity"),
      icon: <Users className="w-6 h-6 text-primary" />,
    },
    {
      title: t("Conscientious"),
      description: t("Alwayslistenandsupportcustomerswholeheartedly"),
      icon: <Heart className="w-6 h-6 text-primary" />,
    },
  ];

  const team = [
    {
      name: "Võ Thanh Tùng",
      position: "Leader",
      image: "/public/img/team/Tung.jpg",
      description: "Lãnh đạo giàu kinh nghiệm, luôn tin tưởng giao nhiệm vụ cho team",
      clusters: ["nhiệm vụ cho team"],
    },
    {
      name: "Vũ Đăng Quang",
      position: "Fullstack",
      image: "/img/team/QuangV.jpg",
      description: "Chuyên gia fullstack với kỹ năng phát triển cả frontend và backend",
      clusters: ["cả frontend và backend"],
    },
    {
      name: "Bùi Minh Quang",
      position: "Fullstack",
      image: "/img/team/QuangB.jpg",
      description: "Fullstack developer với kinh nghiệm xây dựng ứng dụng toàn diện",
      clusters: ["xây dựng ứng dụng toàn diện"],
    },
    {
      name: "Đinh Quốc Tiến",
      position: "Fullstack",
      image: "/img/team/Tien.jpg",
      description: "Lập trình viên fullstack đam mê phát triển hệ thống",
      clusters: ["phát triển hệ thống"],
    },
    {
      name: "Đinh Quốc Huy",
      position: "Fullstack",
      image: "/img/team/Huy.jpg",
      description: "Fullstack với kinh nghiệm phát triển phần mềm",
      clusters: ["phát triển phần mềm"],
    },
  ];

  const topRow = team.slice(0, 2);
  const bottomRow = team.slice(2);

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <FadeInWhenVisible>
            <h1 className="text-4xl font-bold mb-6">{t("AboutTalentHub")}</h1>
          </FadeInWhenVisible>
          <FadeInWhenVisible delay={0.2}>
            <p className="text-xl text-muted-foreground">
              {t(
                "WearetheleadingfreelancerandbusinessconnectionplatforminVietnambringsemploymentandcareerdevelopmentopportunitiestothefreelancercommunity"
              )}
            </p>
          </FadeInWhenVisible>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {values.map((value, index) => (
            <FadeInWhenVisible key={value.title} delay={index * 0.1}>
              <Card className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </Card>
            </FadeInWhenVisible>
          ))}
        </div>

        <div className="max-w-3xl mx-auto text-center mb-16">
          <FadeInWhenVisible>
            <h2 className="text-3xl font-bold mb-6">{t("Ourmission")}</h2>
          </FadeInWhenVisible>
          <FadeInWhenVisible delay={0.2}>
            <p className="text-lg text-muted-foreground">
              {t(
                "WebelievethateveryonehastherighttoworkflexiblyandindependentlyOurmissionistocreateafairandeffectiveworkingenvironmentwherefreelancerscandeveloptheircareersandbusinessesfindpartnerssuitablefortheirprojects"
              )}
            </p>
          </FadeInWhenVisible>
        </div>

        <div className="text-center mb-16">
          <FadeInWhenVisible>
            <h2 className="text-3xl font-bold mb-12">{t("Ourteam")}</h2>
          </FadeInWhenVisible>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 max-w-2xl mx-auto">
            {topRow.map((member, index) => (
              <FadeInWhenVisible key={member.name} delay={index * 0.1}>
                <div>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-muted-foreground mb-2">{member.position}</p>
                  <p className="text-sm text-muted-foreground">
                    {member.clusters && member.clusters.length > 0 ? (
                      splitIntoClusters(member.description, member.clusters).map(
                        (cluster, clusterIndex) => (
                          <FadeInWhenVisible
                            key={clusterIndex}
                            delay={clusterIndex * 0.3}
                          >
                            <span className="inline-block">{cluster}</span>
                          </FadeInWhenVisible>
                        )
                      )
                    ) : (
                      member.description
                    )}
                  </p>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {bottomRow.map((member, index) => (
              <FadeInWhenVisible key={member.name} delay={index * 0.1}>
                <div>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-muted-foreground mb-2">{member.position}</p>
                  <p className="text-sm text-muted-foreground">
                    {member.clusters && member.clusters.length > 0 ? (
                      splitIntoClusters(member.description, member.clusters).map(
                        (cluster, clusterIndex) => (
                          <FadeInWhenVisible
                            key={clusterIndex}
                            delay={clusterIndex * 0.3}
                          >
                            <span className="inline-block">{cluster}</span>
                          </FadeInWhenVisible>
                        )
                      )
                    ) : (
                      member.description
                    )}
                  </p>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
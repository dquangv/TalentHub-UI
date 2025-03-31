import FadeInWhenVisible from "@/components/animations/FadeInWhenVisible";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Users, Shield, Award, Heart } from "lucide-react";

const About = () => {
  const { t } = useLanguage();
  const values = [
    {
      title: t("Quality"),
      description: t(
        "Committedtoprovidingqualityserviceandensuringsatisfaction"
      ),
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
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
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

        {/* Values Section */}
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

        {/* Mission Section */}
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

        {/* Team Section */}
        <div className="text-center mb-16">
          <FadeInWhenVisible>
            <h2 className="text-3xl font-bold mb-12">{t("Ourteam")}</h2>
          </FadeInWhenVisible>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <FadeInWhenVisible key={member.name} delay={index * 0.1}>
                <div>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-muted-foreground mb-2">
                    {member.position}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {member.description}
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

const team = [
  {
    name: "Võ Thanh Tùng",
    position: "Developer",
    image: "/public/img/team/Tung.jpg",
    description: "Nhiều năm kinh nghiệm phát triển sản phẩm và UX design",
  },
  {
    name: "Vũ Đăng Quang",
    position: "Developer",
    image: "/public/img/team/QuangV.jpg",
    description: "Chuyên gia marketing với kinh nghiệm phát triển thương hiệu",
  },
  {
    name: "Bùi Minh Quang",
    position: "Developer",
    image: "/public/img/team/QuangB.jpg",
    description: "Nhiều năm kinh nghiệm phát triển sản phẩm và UX design",
  },
  {
    name: "Đinh Quốc Tiến",
    position: "Developer",
    image: "/public/img/team/Tien.jpg",
    description: "Chuyên gia marketing với kinh nghiệm phát triển thương hiệu",
  },
  {
    name: "Đinh Quốc Huy",
    position: "Developer",
    image: "/public/img/team/Huy.jpg",
    description:
      "Hơn 10 năm kinh nghiệm trong lĩnh vực công nghệ và khởi nghiệp",
  },
];

export default About;

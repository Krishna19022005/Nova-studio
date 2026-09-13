import HomeHero from "../sections/HomeHero";
import HomeCollections from "../sections/HomeCollections";
import HomeProjects from "../sections/HomeProjects";
import HomeCTA from "../sections/HomeCTA";
function Home() {
  return (
    <>
      <HomeHero />
      <HomeCollections/>
      <HomeProjects/>
      <HomeCTA/>
    </>
  );
}

export default Home;
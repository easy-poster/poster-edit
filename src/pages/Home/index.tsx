import ProjectListContainer from './Container/ProjectListContainer';
import SwiperList from './components/SwiperList';
import PeojectHeader from './PeojectHeader';
import ProjectList from './ProjectList';
import styles from './index.less';

const Home = () => {
    return (
        <div className={styles.home} id="home">
            {/* <SwiperList /> */}
            <div className={styles.myProject}>
                <ProjectListContainer>
                    <PeojectHeader />
                    <ProjectList />
                </ProjectListContainer>
            </div>
        </div>
    );
};

export default Home;

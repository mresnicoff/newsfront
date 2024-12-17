
import { Outlet, useNavigation } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const LayoutPublic: React.FC = () => {
    const navigation = useNavigation();

    return (
        <div>
            <Header />
            <main>
                {navigation.state === "loading" && (
                    <div>Loading...</div>
                )}
                <Outlet />
            </main>
            <footer>
                <Footer />
            </footer>
        </div>
    );
};

export default LayoutPublic;


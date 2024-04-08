import FocusTimer from "../components/FocusTimer";
import ServiceMenu from "../components/ServiceMenu";
import TaskDetailsPage from "../components/TaskDetails";

const FocusPage = () => {
    return (
        <div className="flex max-w-screen">
            <div className="">
                <ServiceMenu />
            </div>
            <div className="flex-[10] bg-blue-500">
                <FocusTimer />
            </div>
            <div className="flex-[6] bg-red-500">


            </div>
        </div>
    );
};

export default FocusPage;
import './styles/App.css';
import './styles/MainContent.css';
import { PageLayout } from './components/PageLayout';
import {MainContent} from './components/MainContent';


/**
 * If a user is authenticated the ProfileContent component above is rendered. Otherwise a message indicating a user is not authenticated is rendered.
 */
export default function App() {
    return (
        <PageLayout>
            <MainContent />
        </PageLayout>
    );
}

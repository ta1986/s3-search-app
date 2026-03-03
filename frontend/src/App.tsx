import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

const HomePage = lazy(() => import('./pages/HomePage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

function App() {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <main id="main-content">
            <div className="grid-container padding-y-6 text-center">
              <p>Loading...</p>
            </div>
          </main>
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}

export default App;

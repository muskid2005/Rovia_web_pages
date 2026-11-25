import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ResetPassword from './routes/reset-password';
import VerifyEmail from './routes/verify-email';

function HomeFallback() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div>
        <h1 style={{ fontSize: 22, marginBottom: 8 }}>Rovia Verification</h1>
        <p style={{ color: '#4B5563', fontSize: 14 }}>
          Open the verification or password reset link sent to your email.
        </p>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<HomeFallback />} />
      </Routes>
    </BrowserRouter>
  );
}
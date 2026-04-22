import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'

// Auth
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
// User
import Espaces from './pages/user/Espaces'
import EspaceDetail from './pages/user/EspaceDetail'
import Reservations from './pages/user/Reservations'
import ReservationDetailUser from './pages/user/ReservationDetail'
import Profil from './pages/user/Profil'
// Admin
import Dashboard from './pages/admin/Dashboard'
import AdminEspaces from './pages/admin/Espaces'
import EspaceForm from './pages/admin/EspaceForm'
import Equipements from './pages/admin/Equipements'
import EquipementForm from './pages/admin/EquipementForm'
import AdminReservations from './pages/admin/Reservations'
import ReservationDetail from './pages/admin/ReservationDetail'
import Utilisateurs from './pages/admin/Utilisateurs'
import UtilisateurForm from './pages/admin/UtilisateurForm'
import Categories from './pages/admin/Categories'
import CategorieForm from './pages/admin/CategorieForm'

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <ThemeProvider>
                    <Routes>
                        {/* Public */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/" element={<Navigate to="/login" replace />} />

                        {/* User */}
                        <Route path="/espaces" element={<ProtectedRoute><Espaces /></ProtectedRoute>} />
                        <Route path="/espaces/:id" element={<ProtectedRoute><EspaceDetail /></ProtectedRoute>} />
                        <Route path="/reservations" element={<ProtectedRoute><Reservations /></ProtectedRoute>} />
                        <Route path="/reservations/:id" element={<ProtectedRoute><ReservationDetailUser /></ProtectedRoute>} />
                        <Route path="/profil" element={<ProtectedRoute><Profil /></ProtectedRoute>} />

                        {/* Admin */}
                        <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
                        <Route path="/admin/espaces" element={<ProtectedRoute adminOnly><AdminEspaces /></ProtectedRoute>} />
                        <Route path="/admin/espaces/creer" element={<ProtectedRoute adminOnly><EspaceForm /></ProtectedRoute>} />
                        <Route path="/admin/espaces/:id/modifier" element={<ProtectedRoute adminOnly><EspaceForm /></ProtectedRoute>} />
                        <Route path="/admin/equipements" element={<ProtectedRoute adminOnly><Equipements /></ProtectedRoute>} />
                        <Route path="/admin/equipements/creer" element={<ProtectedRoute adminOnly><EquipementForm /></ProtectedRoute>} />
                        <Route path="/admin/equipements/:id/modifier" element={<ProtectedRoute adminOnly><EquipementForm /></ProtectedRoute>} />
                        <Route path="/admin/reservations" element={<ProtectedRoute adminOnly><AdminReservations /></ProtectedRoute>} />
                        <Route path="/admin/reservations/:id" element={<ProtectedRoute adminOnly><ReservationDetail /></ProtectedRoute>} />
                        <Route path="/admin/utilisateurs" element={<ProtectedRoute adminOnly><Utilisateurs /></ProtectedRoute>} />
                        <Route path="/admin/utilisateurs/creer" element={<ProtectedRoute adminOnly><UtilisateurForm /></ProtectedRoute>} />
                        <Route path="/admin/utilisateurs/:id/modifier" element={<ProtectedRoute adminOnly><UtilisateurForm /></ProtectedRoute>} />
                        <Route path="/admin/categories" element={<ProtectedRoute adminOnly><Categories /></ProtectedRoute>} />
                        <Route path="/admin/categories/creer" element={<ProtectedRoute adminOnly><CategorieForm /></ProtectedRoute>} />
                        <Route path="/admin/categories/:id/modifier" element={<ProtectedRoute adminOnly><CategorieForm /></ProtectedRoute>} />
                    </Routes>
                </ThemeProvider>
            </AuthProvider>
        </BrowserRouter>
    )
}
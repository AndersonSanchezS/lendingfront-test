import { useState } from 'react'
import axios from 'axios'

function App() {
  const [formData, setFormData] = useState({
    taxId: '',
    businessName: '',
    requestedAmount: ''
  })
  const [loanDecision, setLoanDecision] = useState(null)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const response = await axios.post('/api/evaluate-loan', {
        requestedAmount: parseFloat(formData.requestedAmount)
      })
      setLoanDecision(response.data.decision)
    } catch (error) {
      console.error('Error:', error)
      setError('Ha ocurrido un error al procesar su solicitud. Por favor, intente nuevamente.')
      setLoanDecision(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
          <div className="px-6 py-8 sm:p-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Solicitud de Préstamo</h1>
              <p className="text-gray-600">Complete el formulario para evaluar su solicitud</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax ID
                  </label>
                  <input
                    type="text"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleChange}
                    placeholder="Ingrese su Tax ID"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Negocio
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Ingrese el nombre de su negocio"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monto Solicitado
                  </label>
                  <input
                    type="number"
                    name="requestedAmount"
                    value={formData.requestedAmount}
                    onChange={handleChange}
                    placeholder="Ingrese el monto solicitado"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Solicitar Préstamo
              </button>
            </form>

            {error && (
              <div className="mt-8 p-6 rounded-xl bg-red-50 border-2 border-red-200">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-red-800">
                      Error
                    </h3>
                    <p className="mt-2 text-red-600">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {loanDecision && (
              <div className={`mt-8 p-6 rounded-xl border-2 ${
                loanDecision === "Approved" 
                  ? "bg-green-50 border-green-200" 
                  : loanDecision === "Declined" 
                  ? "bg-red-50 border-red-200" 
                  : "bg-yellow-50 border-yellow-200"
              }`}>
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <h3 className={`text-xl font-bold ${
                      loanDecision === "Approved" 
                        ? "text-green-800" 
                        : loanDecision === "Declined" 
                        ? "text-red-800" 
                        : "text-yellow-800"
                    }`}>
                      {loanDecision === "Approved" 
                        ? "¡Préstamo Aprobado!" 
                        : loanDecision === "Declined" 
                        ? "Préstamo Rechazado" 
                        : "Decisión Pendiente"}
                    </h3>
                    <p className={`mt-2 ${
                      loanDecision === "Approved" 
                        ? "text-green-600" 
                        : loanDecision === "Declined" 
                        ? "text-red-600" 
                        : "text-yellow-600"
                    }`}>
                      {loanDecision === "Approved" 
                        ? "Su solicitud ha sido aprobada" 
                        : loanDecision === "Declined" 
                        ? "Lo sentimos, su solicitud no ha sido aprobada" 
                        : "Su solicitud está siendo revisada"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

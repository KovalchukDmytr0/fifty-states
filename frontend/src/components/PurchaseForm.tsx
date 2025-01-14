import { useState, FormEvent, ChangeEvent } from 'react'

interface PurchaseFormProps {
  selectedState: string
}

interface FormData {
  email: string
  pixelX: number
  pixelY: number
  image: File | null
}

const PurchaseForm = ({ selectedState }: PurchaseFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    pixelX: 0,
    pixelY: 0,
    image: null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement
      const file = fileInput.files?.[0] || null
      setFormData(prev => ({ ...prev, [name]: file }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!selectedState) {
      setError('Please select a state first')
      return
    }
    if (!formData.image) {
      setError('Please upload an image')
      return
    }

    setIsSubmitting(true)
    setError('')
    setSuccess('')

    const data = new FormData()
    data.append('email', formData.email)
    data.append('pixelX', formData.pixelX.toString())
    data.append('pixelY', formData.pixelY.toString())
    data.append('state', selectedState)
    data.append('image', formData.image)

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        body: data
      })

      if (!response.ok) {
        throw new Error('Failed to submit order')
      }

      setSuccess('Order submitted successfully!')
      setFormData({
        email: '',
        pixelX: 0,
        pixelY: 0,
        image: null
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit order')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!selectedState && (
        <div className="text-amber-600 bg-amber-50 p-4 rounded-md">
          Please select a state from the map to continue
        </div>
      )}
      
      {selectedState && (
        <>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="pixelX" className="block text-sm font-medium text-gray-700">
                Pixel X Position
              </label>
              <input
                type="number"
                name="pixelX"
                id="pixelX"
                required
                min="0"
                value={formData.pixelX}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="pixelY" className="block text-sm font-medium text-gray-700">
                Pixel Y Position
              </label>
              <input
                type="number"
                name="pixelY"
                id="pixelY"
                required
                min="0"
                value={formData.pixelY}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Upload Image
            </label>
            <input
              type="file"
              name="image"
              id="image"
              required
              accept="image/*"
              onChange={handleInputChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !selectedState}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
          >
            {isSubmitting ? 'Submitting...' : 'Purchase Pixels'}
          </button>
        </>
      )}

      {error && (
        <div className="text-red-600 bg-red-50 p-4 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="text-green-600 bg-green-50 p-4 rounded-md">
          {success}
        </div>
      )}
    </form>
  )
}

export default PurchaseForm 
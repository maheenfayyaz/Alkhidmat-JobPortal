"use client"

import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class NavigationErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Navigation error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Navigation Error
            </h2>
            <p className="text-gray-600 mb-6">
              Something went wrong while navigating. Please try again.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false })
                window.location.href = '/'
              }}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
            >
              Go to Home
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

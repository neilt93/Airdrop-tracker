'use client'

import { useAccount, useConnect } from 'wagmi'

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()

  return (
    <div className="card animate-fade-in">
      <div className="flex flex-col items-center justify-center p-6">
        {isConnected ? (
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-2">Connected Wallet</p>
            <p className="font-mono text-sm bg-gray-800/50 p-2 rounded">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-4">
              Connect your wallet to check eligibility
            </p>
            <div className="flex flex-col gap-2">
              {connectors.map((connector) => (
                <button
                  key={connector.id}
                  onClick={() => connect({ connector })}
                  className="btn-primary relative overflow-hidden group"
                >
                  <span className="relative z-10">
                    Connect with {connector.name}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 
import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'white' | 'minimal'
}

export function Logo({ className, size = 'md', variant = 'default' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  }

  const sizePx = {
    sm: 24,
    md: 32,
    lg: 48
  }

  return (
    <div className={cn(
      'rounded-lg flex items-center justify-center transition-all duration-200',
      sizeClasses[size],
      'hover:scale-105',
      className
    )}>
      <Image
        src="/logo.png"
        alt="Mantle Prime Logo"
        width={sizePx[size]}
        height={sizePx[size]}
        className="object-contain"
        priority
      />
    </div>
  )
}

export function LogoWithText({ 
  className, 
  size = 'md',
  variant = 'default',
  showSubtext = true 
}: LogoProps & { showSubtext?: boolean }) {
  const textSizes = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-2xl'
  }

  const subtextSizes = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-sm'
  }

  return (
    <div className={cn('flex items-center space-x-3', className)}>
      <Logo size={size} variant={variant} />
      <div>
        <h1 className={cn(
          'font-bold text-slate-900 font-heading',
          textSizes[size]
        )}>
          Mantle Prime
        </h1>
        {showSubtext && (
          <p className={cn(
            'text-slate-600 font-body',
            subtextSizes[size]
          )}>
            RWA Credit Marketplace
          </p>
        )}
      </div>
    </div>
  )
}
export function LogoOnly({ 
  size = 32,
  className 
}: { 
  size?: number
  className?: string 
}) {
  return (
    <Image
      src="/logo.png"
      alt="Mantle Prime"
      width={size}
      height={size}
      className={cn("object-contain", className)}
      priority
    />
  )
}
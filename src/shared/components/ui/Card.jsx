import { forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/shared/lib/utils'

const cardVariants = cva('rounded-xl transition-all duration-200', {
  variants: {
    variant: {
      default: 'bg-card border border-border shadow-sm',
      elevated: 'bg-card border border-border shadow-md hover:shadow-lg',
      ghost: 'bg-transparent',
      subtle: 'bg-muted/60 border border-border/40',
      glass: 'glass',
    },
    padding: {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'lg',
  },
})

export const Card = forwardRef(({ className, variant, padding, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(cardVariants({ variant, padding }), className)}
    {...props}
  />
))
Card.displayName = 'Card'

export const CardHeader = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col gap-1 pb-4', className)} {...props} />
))
CardHeader.displayName = 'CardHeader'

export const CardTitle = forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-base font-semibold leading-tight text-foreground', className)}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

export const CardDescription = forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
))
CardDescription.displayName = 'CardDescription'

export const CardContent = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('', className)} {...props} />
))
CardContent.displayName = 'CardContent'

export const CardFooter = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center pt-4', className)} {...props} />
))
CardFooter.displayName = 'CardFooter'

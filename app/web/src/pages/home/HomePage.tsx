import { HeroSection } from './HeroSection'
import { DemoSection } from './DemoSection'
import { TokenSavingsSection } from './TokenSavingsSection'
import { FeaturesSection } from './FeaturesSection'
import { HowItWorksSection } from './HowItWorksSection'
import { CLIPreviewSection } from './CLIPreviewSection'

function SectionDivider() {
  return (
    <div className="h-px w-full" style={{ backgroundColor: 'var(--color-border)', opacity: 0.4 }} />
  )
}

export function HomePage() {
  return (
    <>
      <HeroSection />
      <SectionDivider />
      <DemoSection />
      <SectionDivider />
      <TokenSavingsSection />
      <SectionDivider />
      <FeaturesSection />
      <SectionDivider />
      <HowItWorksSection />
      <SectionDivider />
      <CLIPreviewSection />
    </>
  )
}

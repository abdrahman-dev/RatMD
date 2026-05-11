import { HeroSection } from './HeroSection'
import { DemoSection } from './DemoSection'
import { TokenSavingsSection } from './TokenSavingsSection'
import { FeaturesSection } from './FeaturesSection'
import { HowItWorksSection } from './HowItWorksSection'
import { CLIPreviewSection } from './CLIPreviewSection'

export function HomePage() {
  return (
    <>
      <HeroSection />
      <DemoSection />
      <TokenSavingsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CLIPreviewSection />
    </>
  )
}

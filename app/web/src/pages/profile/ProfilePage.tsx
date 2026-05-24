import { useState, type FormEvent, type ChangeEvent } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/app/store/auth-store'

const AVATAR_OPTIONS = [
  { id: 'rat_default', label: 'R' },
  { id: 'rat_ninja', label: 'N' },
  { id: 'rat_hacker', label: 'H' },
  { id: 'rat_king', label: 'K' },
  { id: 'rat_ghost', label: 'G' },
] as const

export function ProfilePage() {
  const { user, updateProfile } = useAuthStore()
  const [name, setName] = useState(user?.name ?? '')
  const [bio, setBio] = useState(user?.bio ?? '')
  const [github, setGithub] = useState(user?.github ?? '')
  const [linkedin, setLinkedin] = useState(user?.linkedin ?? '')
  const [avatar, setAvatar] = useState(user?.avatar ?? 'rat_default')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setMessage('')
    setSaving(true)
    try {
      await updateProfile({ name, bio, github, linkedin, avatar })
      setMessageType('success')
      setMessage('Looking good. Changes saved.')
    } catch (err: unknown) {
      setMessageType('error')
      setMessage(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const avatarInitial = user?.name?.charAt(0).toUpperCase() ?? 'R'

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text font-sans">Your profile</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Avatar selection */}
          <div className="bg-surface border border-border p-6" >
            <label className="block text-xs font-mono text-text-dim mb-4">Avatar</label>
            <div className="flex flex-col items-center gap-4">
              <span
                className="w-16 h-16 flex items-center justify-center bg-accent/10 text-accent text-2xl font-mono font-bold border border-accent/20"
                
              >
                {AVATAR_OPTIONS.find((a) => a.id === avatar)?.label ?? avatarInitial}
              </span>
              <div className="flex gap-3 flex-wrap justify-center">
                {AVATAR_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAvatar(opt.id)}
                    className={`w-10 h-10 flex items-center justify-center font-mono text-sm font-bold border transition-colors cursor-pointer ${
                      avatar === opt.id
                        ? 'bg-accent/10 text-accent border-accent'
                        : 'bg-surface text-text-dim border-border hover:border-text-dim'
                    }`}
                    
                    aria-label={`Select ${opt.id} avatar`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="profile-name" className="block text-xs font-mono text-text-dim mb-1.5">
              Name
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              className="w-full bg-bg border border-border text-text font-mono text-sm px-3 py-2 focus:outline-none focus:border-accent"
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="profile-bio" className="block text-xs font-mono text-text-dim mb-1.5">
              Bio
            </label>
            <textarea
              id="profile-bio"
              value={bio}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value)}
              maxLength={160}
              rows={3}
              className="w-full bg-bg border border-border text-text font-mono text-sm px-3 py-2 focus:outline-none focus:border-accent resize-none"
              placeholder="Tell us about yourself..."
            />
            <p className="text-xs font-mono text-text-dimmer mt-1 text-right">{bio.length}/160</p>
          </div>

          {/* GitHub */}
          <div>
            <label htmlFor="profile-github" className="block text-xs font-mono text-text-dim mb-1.5">
              GitHub URL
            </label>
            <input
              id="profile-github"
              type="url"
              value={github}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setGithub(e.target.value)}
              className="w-full bg-bg border border-border text-text font-mono text-sm px-3 py-2 focus:outline-none focus:border-accent"
              placeholder="https://github.com/username"
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label htmlFor="profile-linkedin" className="block text-xs font-mono text-text-dim mb-1.5">
              LinkedIn URL
            </label>
            <input
              id="profile-linkedin"
              type="url"
              value={linkedin}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setLinkedin(e.target.value)}
              className="w-full bg-bg border border-border text-text font-mono text-sm px-3 py-2 focus:outline-none focus:border-accent"
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          {/* Submit */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-accent text-bg font-mono font-medium text-sm px-5 py-2 hover:bg-accent-dim transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>

            {message && (
              <p className={`text-xs font-mono text-center ${messageType === 'success' ? 'text-success' : 'text-danger'}`}>
                {message}
              </p>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  )
}

import { usePresence } from '../hooks/usePresence'

export default function PresenceBar() {
  const { activeUsers } = usePresence()

  // Max 3 avatars shown, rest as +N
  const shown    = activeUsers.slice(0, 3)
  const overflow = activeUsers.length - shown.length

  if (activeUsers.length === 0) return null

  return (
    <div className="flex items-center gap-2">

      {/* Stacked avatars */}
      <div className="flex items-center">
        {shown.map((user, i) => (
          <div
            key={user.userId}
            title={user.name}
            style={{
              backgroundColor: user.color,
              // Stack avatars by pulling left
              marginLeft: i === 0 ? 0 : -8,
              zIndex:     shown.length - i,
            }}
            className="
              w-8 h-8 rounded-full flex items-center
              justify-center text-white text-xs font-bold
              border-2 border-white relative
              cursor-pointer hover:scale-110
              transition-transform duration-150
            "
          >
            {user.initials}
          </div>
        ))}

        {/* Overflow badge +N */}
        {overflow > 0 && (
          <div
            style={{ marginLeft: -8, zIndex: 0 }}
            className="
              w-8 h-8 rounded-full bg-gray-200
              flex items-center justify-center
              text-gray-600 text-xs font-bold
              border-2 border-white
            "
          >
            +{overflow}
          </div>
        )}
      </div>

      {/* Text */}
      <span className="text-xs text-gray-400 whitespace-nowrap">
        {activeUsers.length} viewing
      </span>

    </div>
  )
}
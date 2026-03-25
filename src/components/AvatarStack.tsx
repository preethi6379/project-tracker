type User = {
  userId:   string
  color:    string
  initials: string
  name:     string
}

type Props = {
  users: User[]
}

export default function AvatarStack({ users }: Props) {
  if (users.length === 0) return null
  const shown    = users.slice(0, 2)
  const overflow = users.length - shown.length

  return (
    <div className="flex items-center">
      {shown.map((user, i) => (
        <div
          key={user.userId}
          title={`${user.name} is viewing`}
          style={{
            backgroundColor: user.color,
            marginLeft:      i === 0 ? 0 : -6,
            zIndex:          shown.length - i,
          }}
          className="
            w-5 h-5 rounded-full
            flex items-center justify-center
            text-white text-[9px] font-bold
            border-2 border-white relative
            animate-pulse
          "
        >
          {user.initials}
        </div>
      ))}

      {overflow > 0 && (
        <div
          style={{ marginLeft: -6 }}
          className="
            w-5 h-5 rounded-full bg-gray-300
            flex items-center justify-center
            text-gray-600 text-[9px] font-bold
            border-2 border-white
          "
        >
          +{overflow}
        </div>
      )}
    </div>
  )
}
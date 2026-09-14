type Tab = { id: string; label: string }

type Props = {
  tabs: Tab[]
  active: string
  onChange: (id: string) => void
  ariaLabel?: string
}

export function MobileWorkspaceTabs({ tabs, active, onChange, ariaLabel = 'Workspace view' }: Props) {
  return (
    <div className="workspace-mobile-tabs" role="tablist" aria-label={ariaLabel}>
      {tabs.map((tab) => {
        const selected = tab.id === active
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            className={selected ? 'active' : ''}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

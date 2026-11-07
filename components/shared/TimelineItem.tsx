import ImageBox from '@/components/shared/ImageBox'
import type { MilestoneItem } from '@/types'

export function TimelineItem({
  isLast,
  milestone,
}: {
  isLast: boolean
  milestone: MilestoneItem
}) {
  const { description, duration, image, tags, title } = milestone
  const startYear = duration?.start
    ? new Date(duration.start).getFullYear()
    : undefined
  const endYear = duration?.end ? new Date(duration.end).getFullYear() : 'Now'

  return (
    <div className={`flex min-h-[200px] font-sans ${!isLast && 'pb-2'}`}>
      <div className="flex flex-col">
        {/* Thumbnail */}
        <div
          className="relative overflow-hidden rounded-md bg-black"
          style={{ width: '65px', height: '65px' }}
        >
          <ImageBox
            image={image}
            alt={title || 'Timeline item icon'}
            size="10vw"
            width={65}
            height={65}
          />
        </div>
        {/* Vertical line */}
        {!isLast && <div className="mt-2 w-px grow self-center bg-gray-200" />}
      </div>
      <div className="flex-initial pl-4">
        {/* Title */}
        <div className="font-bold text-black">{title}</div>
        {/* Tags */}
        <div className="text-sm">
          {tags?.map((tag, key) => (
            <span className="site-tag mb-1 mr-1" key={key}>
              {tag}
            </span>
          ))}
          <span className="text-gray-600">
            {startYear} - {endYear}
          </span>
        </div>
        {/* Description */}
        <div className="pb-5 pt-3 font-serif text-gray-600">{description}</div>
      </div>
    </div>
  )
}

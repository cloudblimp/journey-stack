export default function JournalCard({
  title,
  date,
  excerpt,
  image,
  tags = [],
  featured = false,
  onClick,
}) {
  return (
    <article 
      onClick={onClick}
      className={`
        bg-stone-50 rounded-lg shadow-md overflow-hidden cursor-pointer
        transition-all duration-300 hover:shadow-lg
        ${featured ? 'border-l-4 border-emerald-800' : ''}
      `}
    >
      {image && (
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex gap-2 mb-2">
          {tags.map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-600"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <h3 className="font-serif text-xl text-zinc-800 font-medium mb-1">
          {title}
        </h3>
        
        <time className="text-sm text-zinc-500">
          {new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </time>
        
        {excerpt && (
          <p className="mt-2 text-zinc-600 line-clamp-3">
            {excerpt}
          </p>
        )}
      </div>
    </article>
  );
}
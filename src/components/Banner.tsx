import { Radio } from 'lucide-react';

async function getLatestNews() {
  try {
    const res = await fetch('https://api.spaceflightnewsapi.net/v4/articles/?limit=1', { next: { revalidate: 300 }});
    const data = await res.json();
    return data.results[0];
  } catch (e) {
    return null;
  }
}

export default async function Banner() {
  const news = await getLatestNews();

  return (
    <div className="w-full bg-blue-600/20 border-b border-blue-500/30 backdrop-blur-sm p-3 flex flex-col md:flex-row items-center justify-between px-6 text-blue-100 gap-2 md:gap-0">
      <div className="flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
        <span className="font-bold tracking-wider text-sm uppercase whitespace-nowrap">What's Happening Now</span>
      </div>
      
      {news ? (
        <a href={news.url} target="_blank" rel="noreferrer" className="text-sm truncate max-w-xs md:max-w-2xl hover:text-white transition-colors">
           <Radio className="inline w-4 h-4 mr-2" />
           {news.title}
        </a>
      ) : (
        <span className="text-sm">Monitoring Space Traffic...</span>
      )}
      
      <div className="text-xs font-mono opacity-70">
        {new Date().toLocaleDateString()}
      </div>
    </div>
  );
}

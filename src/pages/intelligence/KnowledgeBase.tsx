import { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';
import { Database, FileText, UploadCloud, Search, Plus, Loader2 } from 'lucide-react';

export function KnowledgeBase() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const res = await apiFetch('/api/kb/documents');
      const data = await res.json();
      setDocuments(data.data || []);
    } catch(e) {
      console.error(e);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setIsUploading(true);
    try {
      await apiFetch('/api/kb/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, content: newContent }) // This kicks off background embed
      });
      setShowAdd(false);
      setNewTitle('');
      setNewContent('');
      fetchDocs();
    } catch(e) {
      console.error(e);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const res = await apiFetch('/api/kb/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }) 
      });
      const data = await res.json();
      setSearchResults(data.context || []);
    } catch(e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative p-10">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Database className="text-indigo-500" /> Vector Knowledge Base
            </h2>
            <p className="text-muted-foreground mt-2">Manage the intelligent foundation dataset for your autonomous agents.</p>
          </div>
          <button 
            onClick={() => setShowAdd(!showAdd)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2"
          >
            {showAdd ? 'Cancel' : <><Plus className="w-4 h-4" /> Add Document</>}
          </button>
        </div>

        {showAdd && (
          <form onSubmit={handleAdd} className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-medium">Index New Material</h3>
            <div>
               <input 
                 className="w-full bg-muted/30 border rounded-lg px-4 py-2 outline-none focus:border-primary/50 text-sm"
                 placeholder="Document Title" 
                 required
                 value={newTitle}
                 onChange={e => setNewTitle(e.target.value)}
               />
            </div>
            <div>
               <textarea 
                 rows={6}
                 required
                 className="w-full bg-muted/30 border rounded-lg px-4 py-2 outline-none focus:border-primary/50 text-sm resize-none"
                 placeholder="Paste article, guide, or policy content here. This text will be embedded contextually." 
                 value={newContent}
                 onChange={e => setNewContent(e.target.value)}
               />
            </div>
            <div className="flex justify-end">
              <button disabled={isUploading} type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2">
                {isUploading && <Loader2 className="w-4 h-4 animate-spin" />} Save & Embed
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
             <h3 className="font-medium text-muted-foreground uppercase text-xs tracking-wider">Indexed Database</h3>
             <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
                {documents.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground">
                    <Database className="w-10 h-10 mx-auto mb-3 opacity-20" />
                    <p>No documents vectorized yet.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/50">
                    {documents.map(doc => (
                      <div key={doc.id} className="p-4 flex items-start gap-4 hover:bg-muted/30 transition-colors">
                        <div className="bg-indigo-500/10 p-2 rounded text-indigo-500">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                           <h4 className="font-medium text-sm">{doc.title}</h4>
                           <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{doc.content}</p>
                           <p className="text-[10px] text-muted-foreground/60 mt-2 font-mono">{doc.id} • {new Date(doc.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
             </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-muted-foreground uppercase text-xs tracking-wider">Test Similarity Search</h3>
            <div className="bg-card border border-border/50 rounded-2xl p-5">
              <form onSubmit={handleSearch} className="flex gap-2">
                 <input 
                   placeholder="Ask something..." 
                   className="flex-1 bg-muted/30 border rounded-lg px-3 py-1.5 text-sm outline-none focus:border-primary/50" 
                   value={searchQuery}
                   onChange={e => setSearchQuery(e.target.value)}
                 />
                 <button type="submit" disabled={isSearching} className="bg-muted hover:bg-muted/80 w-8 flex items-center justify-center rounded-lg disabled:opacity-50">
                    {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                 </button>
              </form>

              {searchResults.length > 0 && (
                <div className="mt-4 space-y-3">
                  <div className="text-xs font-semibold text-success mb-2 border-b pb-1">Top Matches (Cosine Similarity)</div>
                  {searchResults.map((res: any, idx: number) => (
                    <div key={idx} className="bg-muted/30 p-2 rounded border border-border/30">
                       <span className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 px-1 py-0.5 rounded mr-1">
                         {(res.score * 100).toFixed(1)}% Match
                       </span>
                       <p className="text-xs mt-1 text-foreground/80 line-clamp-3">{res.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Database, FileText } from 'lucide-react';

export function KnowledgeBase() {
  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative p-10">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Database className="text-indigo-500" /> Vector Knowledge Base
          </h2>
          <p className="text-muted-foreground mt-2">Manage the foundational data embeddings consumed by your AI instances.</p>
        </div>
        <div className="bg-card border rounded-2xl p-8 shadow-sm text-center py-20">
          <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Vector database cluster connecting. Readying indexing engine.</p>
        </div>
      </div>
    </div>
  );
}

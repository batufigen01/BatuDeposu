import { Calendar } from 'lucide-react';

export function ScheduledPosts() {
  return (
    <div className="text-center py-12">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Gönderi Planlama</h2>
        <p className="text-slate-600 mb-6">
          Sosyal medya gönderilerinizi planlayın ve otomatik olarak yayınlayın
        </p>
        <p className="text-sm text-slate-500">
          Bu özellik yakında eklenecek
        </p>
      </div>
    </div>
  );
}

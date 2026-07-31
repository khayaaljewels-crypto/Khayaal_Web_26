import { useState } from 'react';
import { useProducts } from '@/context/ProductsContext';
import { runImport } from '@/services/importApi';
import { useToast } from '@/admin/context/ToastContext';

// TEMPORARY, ONE-TIME TOOL — remove this page (and this route/sidebar link)
// once you've confirmed the sync below succeeded and the storefront/admin
// are reading from the database correctly. It exists only to move whatever
// is sitting in THIS BROWSER's localStorage (added via the old, pre-database
// admin dashboard) into Postgres before that localStorage data becomes
// unreachable. Categories/collections are read directly from their old
// localStorage keys, since CategoriesContext/CollectionsContext have
// already been switched over to the database-backed API.
function readOldTaxonomy(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function MigrateData() {
  const { allProducts } = useProducts();
  const [report, setReport] = useState(null);
  const [running, setRunning] = useState(false);
  const toast = useToast();

  const categories = readOldTaxonomy('khayaal_categories_v3');
  const collections = readOldTaxonomy('khayaal_collections_v4');

  const handleRun = async () => {
    setRunning(true);
    setReport(null);
    try {
      const result = await runImport({ categories, collections, products: allProducts });
      setReport(result);
      toast.success('Import finished — review the report below.');
    } catch (err) {
      toast.error(err.message || 'Import failed.');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">One-Time Setup</p>
        <h1 className="mt-2 font-heading text-3xl text-brown">Sync Local Data to Database</h1>
        <p className="mt-2 max-w-2xl text-sm text-text/60">
          This browser currently has <strong>{categories.length}</strong> categor{categories.length === 1 ? 'y' : 'ies'},{' '}
          <strong>{collections.length}</strong> collection{collections.length === 1 ? '' : 's'}, and{' '}
          <strong>{allProducts.length}</strong> product{allProducts.length === 1 ? '' : 's'} saved locally (from before the
          database migration). Click below to push all of it into the database — existing images are automatically rehosted
          to Cloudinary. Safe to re-run; existing rows are updated in place, not duplicated.
        </p>
      </div>

      <button
        onClick={handleRun}
        disabled={running}
        className="flex items-center gap-2 rounded-full bg-brown px-6 py-3 text-sm font-medium text-white hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60"
      >
        {running && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
        {running ? 'Syncing…' : 'Sync Local Data to Database'}
      </button>

      {report && (
        <div className="space-y-4">
          <ReportSection title="Categories" items={report.categories} />
          <ReportSection title="Collections" items={report.collections} />
          <ReportSection
            title="Products"
            items={report.products}
            renderExtra={(item) =>
              item.images?.length > 0 && (
                <ul className="mt-1 space-y-0.5 pl-4 text-xs text-text/50">
                  {item.images.map((img, i) => (
                    <li key={i} className={img.status === 'failed' ? 'text-red-500' : ''}>
                      Image {i + 1}: {img.status}
                      {img.reason ? ` — ${img.reason}` : ''}
                    </li>
                  ))}
                </ul>
              )
            }
          />
        </div>
      )}
    </div>
  );
}

function ReportSection({ title, items, renderExtra }) {
  if (!items?.length) return null;
  const failedCount = items.filter((i) => i.status === 'failed').length;

  return (
    <div className="rounded-2xl border border-border bg-white p-6">
      <p className="font-heading text-lg text-brown">
        {title} ({items.length}{failedCount > 0 ? `, ${failedCount} failed` : ''})
      </p>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((item, i) => (
          <li key={i}>
            <div className={item.status === 'failed' ? 'text-red-600' : 'text-green-700'}>
              {item.status === 'failed' ? '✕' : '✓'} {item.name}
              {item.status === 'failed' && item.reason ? ` — ${item.reason}` : ''}
            </div>
            {renderExtra?.(item)}
          </li>
        ))}
      </ul>
    </div>
  );
}

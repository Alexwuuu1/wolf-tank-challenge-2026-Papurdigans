import { useState } from 'react';
import { Edit3, PackagePlus, Plus, Power, Save, Search, X } from 'lucide-react';

const emptyProduct = {
  id: null,
  categoryId: '',
  name: '',
  description: '',
  price: '',
  imageUrl: '',
  active: true
};

export function Catalog({ api, products, categories, onAdd, onReload }) {
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [catalogError, setCatalogError] = useState('');
  const filtered = products.filter(product => `${product.name} ${product.category}`.toLowerCase().includes(search.toLowerCase()));

  function editProduct(product) {
    setDraft({
      id: product.id,
      categoryId: product.categoryId,
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      active: Boolean(product.active)
    });
    setCatalogError('');
  }

  async function saveProduct(event) {
    event.preventDefault();
    setSaving(true);
    setCatalogError('');
    try {
      await api.request(draft.id ? `/products/${draft.id}` : '/products', {
        method: draft.id ? 'PUT' : 'POST',
        body: JSON.stringify({
          ...draft,
          categoryId: Number(draft.categoryId),
          price: Number(draft.price)
        })
      });
      setDraft(emptyProduct);
      await onReload();
    } catch (err) {
      setCatalogError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function toggleProduct(product) {
    await api.request(`/products/${product.id}/active`, {
      method: 'PATCH',
      body: JSON.stringify({ active: !product.active })
    });
    await onReload();
  }

  return (
    <section className="catalogAdmin">
      <div className="module">
        <div className="moduleHeader">
          <div>
            <h2>Catalogo digital</h2>
            <p>Productos visibles para clientes externos.</p>
          </div>
          <label className="searchBox">
            <Search size={18} />
            <input placeholder="Buscar ramo, detalle..." value={search} onChange={event => setSearch(event.target.value)} />
          </label>
        </div>
        <div className="catalogGrid">
          {filtered.map(product => (
            <article className={`productCard ${product.active ? '' : 'inactive'}`} key={product.id}>
              <img src={product.imageUrl} alt={product.name} />
              <div>
                <span className="tag">{product.category}</span>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <footer>
                  <strong>Bs {Number(product.price).toFixed(0)}</strong>
                  <span className={product.active ? 'statusTag activeTag' : 'statusTag inactiveTag'}>
                    {product.active ? 'Activo' : 'Oculto'}
                  </span>
                </footer>
                <div className="cardActions">
                  <button type="button" title="Editar producto" onClick={() => editProduct(product)}>
                    <Edit3 size={17} />
                  </button>
                  <button type="button" title={product.active ? 'Ocultar producto' : 'Activar producto'} onClick={() => toggleProduct(product)}>
                    <Power size={17} />
                  </button>
                  <button type="button" title="Agregar al nuevo pedido" disabled={!product.active} onClick={() => onAdd(product)}>
                    <PackagePlus size={17} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <form className="module productForm" onSubmit={saveProduct}>
        <div className="moduleHeader">
          <div>
            <h2>{draft.id ? 'Editar producto' : 'Nuevo producto'}</h2>
            <p>Administra el catalogo usado por clientes y pedidos.</p>
          </div>
        </div>
        <select required value={draft.categoryId} onChange={event => setDraft({ ...draft, categoryId: event.target.value })}>
          <option value="">Categoria</option>
          {categories.map(category => <option value={category.id} key={category.id}>{category.name}</option>)}
        </select>
        <input required placeholder="Nombre del producto" value={draft.name} onChange={event => setDraft({ ...draft, name: event.target.value })} />
        <input required type="number" min="1" step="0.01" placeholder="Precio en Bs" value={draft.price} onChange={event => setDraft({ ...draft, price: event.target.value })} />
        <input required placeholder="URL de imagen" value={draft.imageUrl} onChange={event => setDraft({ ...draft, imageUrl: event.target.value })} />
        <textarea required placeholder="Descripcion" value={draft.description} onChange={event => setDraft({ ...draft, description: event.target.value })} />
        <label className="checkRow">
          <input type="checkbox" checked={draft.active} onChange={event => setDraft({ ...draft, active: event.target.checked })} />
          Visible en catalogo
        </label>
        {catalogError && <p className="error">{catalogError}</p>}
        <div className="formActions">
          <button type="submit" disabled={saving}>
            {draft.id ? <Save size={18} /> : <Plus size={18} />}
            {draft.id ? 'Guardar cambios' : 'Crear producto'}
          </button>
          {draft.id && (
            <button className="secondaryButton" type="button" onClick={() => setDraft(emptyProduct)}>
              <X size={18} />
              Cancelar
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

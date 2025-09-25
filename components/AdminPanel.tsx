import React, { useState, createRef, useRef, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Product, BulkUpdatePayload } from '../types';
import './AdminPanel.css';
import { FaTrash, FaPrint, FaPlus, FaSyncAlt, FaPencilAlt, FaSave, FaTimes } from 'react-icons/fa';


interface AdminPanelProps {
    onAddProduct: (product: Omit<Product, 'id' | 'm2' | 'isBelowMinM2'>) => void;
    products: Product[];
    onRemoveProduct: (id: number) => void;
    onUpdateProduct: (id: number, product: Omit<Product, 'id' | 'm2' | 'isBelowMinM2'>) => void;
    handlePrint: () => void;
    onUpdateAllProducts: (payload: BulkUpdatePayload) => void;
    cariUnvan: string;
    musteri: string;
    onCariUnvanChange: (value: string) => void;
    onMusteriChange: (value: string) => void;
}

type ProductType = 'isicam' | 'tekcam' | 'ayna' | 'lamine';
type AynaKesimTuru = 'duz' | 'elips' | 'yuvarlakCap';

const AdminPanel: React.FC<AdminPanelProps> = ({
    onAddProduct,
    products,
    onRemoveProduct,
    onUpdateProduct,
    handlePrint,
    onUpdateAllProducts,
    cariUnvan,
    musteri,
    onCariUnvanChange,
    onMusteriChange,
}) => {
    const glassCompositions = ['4+9+4', '4+11+4', '4+12+4', '4+14+4', '4+16+4', '4+20+4', '4+22+4'];
    const glassTypes = ['DÜZCAM', 'TEK TARAF FÜME', 'ÇİFT TARAF FÜME', 'LOW-E'];
    const glassPatterns = ['YOK', 'BUZLU TOPRAK', 'BUZLU LİMON', 'FÜME', 'SATİNA'];
    const tekcamOptions = ['4MM', '5MM', '6MM', '8MM', '10MM'];
    const delikCapiOptions = ['YOK', 'BACA', 'MENFEZ'];

    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [productType, setProductType] = useState<ProductType>('isicam');
    const [selectedComposition, setSelectedComposition] = useState('4+12+4');
    const [selectedType, setSelectedType] = useState(glassTypes[0]);
    const [selectedPattern, setSelectedPattern] = useState(glassPatterns[0]);
    const [delikCapi, setDelikCapi] = useState(delikCapiOptions[0]);
    const [tekcamThickness, setTekcamThickness] = useState(tekcamOptions[0]);
    const [aynaThickness, setAynaThickness] = useState('4MM');
    const [aynaKesimTuru, setAynaKesimTuru] = useState<AynaKesimTuru>('duz');

    const [gen, setGen] = useState('');
    const [yuk, setYuk] = useState('');
    const [adet, setAdet] = useState('');
    const [yamukFarki, setYamukFarki] = useState('');

    const genislikInputRef = useRef<HTMLInputElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (productType !== 'ayna' && productType !== 'tekcam') {
            setAynaKesimTuru('duz');
        }
        if (productType !== 'isicam') {
            setDelikCapi('YOK');
            setSelectedPattern('YOK');
        }
        if (productType === 'ayna') {
            setAynaThickness('4MM');
        }
    }, [productType]);
    
    useEffect(() => {
        // Bir desen seçildiğinde (YOK hariç), cam tipi seçimini devre dışı bırak
        // ve tipi varsayılan olarak 'DÜZCAM' yap.
        if (selectedPattern !== 'YOK') {
            setSelectedType('DÜZCAM');
        }
    }, [selectedPattern]);


    useEffect(() => {
        if (editingProduct) {
            setGen(String(editingProduct.gen));
            setYuk(String(editingProduct.yuk));
            setAdet(String(editingProduct.adet));
            setYamukFarki(String(editingProduct.yamukFarki || ''));

            const cins = editingProduct.cins;
            if (cins.includes('ISI YALITIMLI ÇİFTCAM')) {
                setProductType('isicam');
                
                if (cins.includes('BACA')) setDelikCapi('BACA');
                else if (cins.includes('MENFEZ')) setDelikCapi('MENFEZ');
                else setDelikCapi('YOK');
                
                const cinsForParsing = cins.replace(/ - (BACA|MENFEZ)/, '');

                const parts = cinsForParsing.split(' - ');
                const comp = parts[0].replace(' ISI YALITIMLI ÇİFTCAM', '').trim();
                if (glassCompositions.includes(comp)) setSelectedComposition(comp);
                
                setSelectedType(glassTypes[0]);
                setSelectedPattern(glassPatterns[0]);

                if (parts.length > 1) {
                    const feature = parts[1].trim();
                    if (glassPatterns.includes(feature)) {
                        setSelectedPattern(feature);
                    } else if (glassTypes.includes(feature)) {
                        setSelectedType(feature);
                    }
                }

            } else if (cins.includes('TEKCAM')) {
                setProductType('tekcam');
                if (editingProduct.elips) setAynaKesimTuru('elips');
                else if (editingProduct.yuvarlakCap) setAynaKesimTuru('yuvarlakCap');
                else setAynaKesimTuru('duz');
                
                const thickness = cins.replace(' TEKCAM', '').replace(' - ELİPS', '').replace(' - YUV.ÇAP', '').trim();
                if (tekcamOptions.includes(thickness)) setTekcamThickness(thickness);

            } else if (cins.includes('4+4 LAMİNE CAM')) {
                setProductType('lamine');
            } else if (cins.includes('AYNA')) {
                setProductType('ayna');
                if (editingProduct.elips) setAynaKesimTuru('elips');
                else if (editingProduct.yuvarlakCap) setAynaKesimTuru('yuvarlakCap');
                else setAynaKesimTuru('duz');
            }
        }
    }, [editingProduct]);

    const resetForm = () => {
        setGen('');
        setYuk('');
        setAdet('');
        setYamukFarki('');
        setAynaKesimTuru('duz');
        setEditingProduct(null);
        setProductType('isicam');
        setSelectedComposition('4+12+4');
        setSelectedType(glassTypes[0]);
        setSelectedPattern(glassPatterns[0]);
        setDelikCapi(delikCapiOptions[0]);
        setTekcamThickness(tekcamOptions[0]);
        genislikInputRef.current?.focus();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (gen && yuk && adet) {
            let combinedCins = '';
            switch(productType) {
                case 'isicam':
                    let isicamCins = `${selectedComposition} ISI YALITIMLI ÇİFTCAM`;
                    if (selectedPattern !== 'YOK') {
                        isicamCins += ` - ${selectedPattern}`;
                    } else {
                        isicamCins += ` - ${selectedType}`;
                    }
                    if (delikCapi !== 'YOK') isicamCins += ` - ${delikCapi}`;
                    combinedCins = isicamCins;
                    break;
                case 'tekcam':
                    let tekcamCins = `${tekcamThickness} TEKCAM`;
                    if (aynaKesimTuru === 'elips') tekcamCins += ' - ELİPS';
                    else if (aynaKesimTuru === 'yuvarlakCap') tekcamCins += ' - YUV.ÇAP';
                    combinedCins = tekcamCins;
                    break;
                case 'ayna':
                    let aynaCins = `${aynaThickness} AYNA`;
                    if (aynaKesimTuru === 'elips') aynaCins += ' - ELİPS';
                    else if (aynaKesimTuru === 'yuvarlakCap') aynaCins += ' - YUV.ÇAP';
                    combinedCins = aynaCins;
                    break;
                case 'lamine':
                    combinedCins = '4+4 LAMİNE CAM';
                    break;
            }

            const productData = {
                cins: combinedCins.toLocaleUpperCase('tr-TR'),
                gen: parseFloat(gen),
                yuk: parseFloat(yuk),
                adet: parseInt(adet, 10),
                yamukFarki: parseFloat(yamukFarki) || undefined,
                elips: (productType === 'ayna' || productType === 'tekcam') && aynaKesimTuru === 'elips',
                yuvarlakCap: (productType === 'ayna' || productType === 'tekcam') && aynaKesimTuru === 'yuvarlakCap',
                delikCapi: productType === 'isicam' && delikCapi !== 'YOK' ? delikCapi : undefined,
            };
            
            if (editingProduct) {
                onUpdateProduct(editingProduct.id, productData);
            } else {
                onAddProduct(productData);
            }
            resetForm();
        }
    };
    
    const handleBulkUpdate = () => {
        let newCins = '';
        const isElips = (productType === 'ayna' || productType === 'tekcam') && aynaKesimTuru === 'elips';
        const isYuvarlak = (productType === 'ayna' || productType === 'tekcam') && aynaKesimTuru === 'yuvarlakCap';

        switch (productType) {
            case 'isicam':
                let isicamCins = `${selectedComposition} ISI YALITIMLI ÇİFTCAM`;
                if (selectedPattern !== 'YOK') {
                    isicamCins += ` - ${selectedPattern}`;
                } else {
                    isicamCins += ` - ${selectedType}`;
                }
                if (delikCapi !== 'YOK') isicamCins += ` - ${delikCapi}`;
                newCins = isicamCins;
                break;
            case 'tekcam':
                let tekcamCins = `${tekcamThickness} TEKCAM`;
                if (isElips) tekcamCins += ' - ELİPS';
                else if (isYuvarlak) tekcamCins += ' - YUV.ÇAP';
                newCins = tekcamCins;
                break;
            case 'ayna':
                let aynaCins = `${aynaThickness} AYNA`;
                if (isElips) aynaCins += ' - ELİPS';
                else if (isYuvarlak) aynaCins += ' - YUV.ÇAP';
                newCins = aynaCins;
                break;
            case 'lamine':
                newCins = '4+4 LAMİNE CAM';
                break;
        }
        if (newCins) {
            onUpdateAllProducts({
                cins: newCins.toLocaleUpperCase('tr-TR'),
                elips: isElips,
                yuvarlakCap: isYuvarlak,
                delikCapi: productType === 'isicam' && delikCapi !== 'YOK' ? delikCapi : undefined,
            });
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        panelRef.current?.scrollTo(0, 0);
    };

    return (
        <div className="admin-panel" ref={panelRef}>
            <h1 className="admin-title">SİPARİŞ KONTROL PANELİ</h1>

            <div className="card">
                <h2 className="card-title">{editingProduct ? 'ÜRÜNÜ DÜZENLE' : 'YENİ ÜRÜN EKLE'}</h2>
                <form onSubmit={handleSubmit} className="product-form">
                    
                    <fieldset className="form-group">
                        <legend>Müşteri Bilgileri</legend>
                        <div className="form-grid">
                           <input type="text" value={cariUnvan} onChange={e => onCariUnvanChange(e.target.value.toLocaleUpperCase('tr-TR'))} placeholder="Cari Ünvan" aria-label="Cari Ünvan" />
                           <input type="text" value={musteri} onChange={e => onMusteriChange(e.target.value.toLocaleUpperCase('tr-TR'))} placeholder="Müşteri" aria-label="Müşteri" />
                        </div>
                    </fieldset>

                    <div className="product-type-selector">
                        <label><input type="radio" name="productType" value="isicam" checked={productType === 'isicam'} onChange={() => setProductType('isicam')} /> ISICAM</label>
                        <label><input type="radio" name="productType" value="tekcam" checked={productType === 'tekcam'} onChange={() => setProductType('tekcam')} /> TEKCAM</label>
                        <label><input type="radio" name="productType" value="ayna" checked={productType === 'ayna'} onChange={() => setProductType('ayna')} /> AYNA</label>
                        <label><input type="radio" name="productType" value="lamine" checked={productType === 'lamine'} onChange={() => setProductType('lamine')} /> 4+4 LAMİNE</label>
                    </div>

                    <button type="button" onClick={handleBulkUpdate} className="bulk-update-button" aria-label="Seçili cinsi tüm ürünlere uygula" title="Seçili cinsi tüm ürünlere uygula" disabled={products.length === 0}>
                        <FaSyncAlt /> SEÇİLİ CİNSİ TÜMÜNE UYGULA
                    </button>

                    <fieldset className="form-group" disabled={productType !== 'isicam'}>
                         <legend>Isıcam Seçenekleri</legend>
                         <div className="form-row">
                            <select value={selectedComposition} onChange={e => setSelectedComposition(e.target.value)} aria-label="Cam Kalınlığı">
                                {glassCompositions.map(comp => (
                                    <option key={comp} value={comp}>{`${comp} ISI YALITIMLI ÇİFTCAM`}</option>
                                ))}
                            </select>
                        </div>
                        <select value={selectedType} onChange={e => setSelectedType(e.target.value)} aria-label="Cam Tipi" disabled={selectedPattern !== 'YOK'}>
                            {glassTypes.map(type => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                        <select value={selectedPattern} onChange={e => setSelectedPattern(e.target.value)} aria-label="Cam Deseni">
                            {glassPatterns.map(pattern => (
                                <option key={pattern} value={pattern}>{pattern}</option>
                            ))}
                        </select>
                        <select value={delikCapi} onChange={e => setDelikCapi(e.target.value)} aria-label="Delik Çapı">
                            {delikCapiOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </fieldset>
                    
                     <fieldset className="form-group" disabled={productType !== 'tekcam'}>
                        <legend>Tekcam Kalınlığı</legend>
                        <select value={tekcamThickness} onChange={e => setTekcamThickness(e.target.value)} aria-label="Tekcam Kalınlığı">
                            {tekcamOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </fieldset>

                     <fieldset className="form-group" disabled={productType !== 'ayna'}>
                        <legend>Ayna Kalınlığı</legend>
                        <select value={aynaThickness} onChange={e => setAynaThickness(e.target.value)} aria-label="Ayna Kalınlığı">
                           <option value="4MM">4MM</option>
                        </select>
                    </fieldset>

                    <fieldset className="form-group" disabled={productType !== 'lamine'}>
                        <legend>Lamine Cam</legend>
                        <p className="info-text">STANDART 4+4 LAMİNE CAM SEÇİLİDİR.</p>
                    </fieldset>


                    <fieldset className="form-group">
                         <legend>Ölçüler ve Kesim</legend>
                        <div className="form-grid">
                            <input ref={genislikInputRef} type="number" value={gen} onChange={e => setGen(e.target.value)} placeholder="Genişlik (cm)" required aria-label="Genişlik" />
                            <input type="number" value={yuk} onChange={e => setYuk(e.target.value)} placeholder="Yükseklik (cm)" required aria-label="Yükseklik" />
                            <input type="number" value={adet} onChange={e => setAdet(e.target.value)} placeholder="Adet" required aria-label="Adet" />
                            <div className="special-cut-inputs-container">
                                <input type="number" value={yamukFarki} onChange={e => setYamukFarki(e.target.value)} placeholder="Yamuk Farkı (cm)" aria-label="Yamuk Farkı" />
                                {(productType === 'ayna' || productType === 'tekcam') && (
                                   <select value={aynaKesimTuru} onChange={e => setAynaKesimTuru(e.target.value as AynaKesimTuru)} aria-label="Ayna Kesim Türü">
                                       <option value="duz">DÜZ KESİM</option>
                                       <option value="elips">ELİPS KESİM</option>
                                       <option value="yuvarlakCap">YUVARLAK ÇAP</option>
                                   </select>
                                )}
                            </div>
                        </div>
                    </fieldset>

                    <div className="form-actions">
                        <button type="submit" className={editingProduct ? "update-button" : "add-button"}>
                            {editingProduct ? <><FaSave /> GÜNCELLE</> : <><FaPlus /> ÜRÜN EKLE</>}
                        </button>
                        {editingProduct && (
                            <button type="button" onClick={resetForm} className="cancel-button">
                                <FaTimes /> İPTAL
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="card product-list-card">
                <h2 className="card-title">EKLENEN ÜRÜNLER ({products.length})</h2>
                <div className="product-list-container">
                    <TransitionGroup component="ul" className="product-list">
                        {products.map((p) => {
                            const nodeRef = createRef<HTMLLIElement>();
                            return (
                                <CSSTransition key={p.id} timeout={300} classNames="item" nodeRef={nodeRef}>
                                    <li className="product-list-item" ref={nodeRef}>
                                        <span className="product-list-item-text">{p.cins} - {p.gen}x{p.yuk} cm - {p.adet} adet {p.yamukFarki ? `(Yamuk: ${p.yamukFarki}cm)` : ''}</span>
                                        <div className="item-actions">
                                            <button onClick={() => handleEdit(p)} className="edit-button" aria-label={`Düzenle: ${p.cins}`}><FaPencilAlt /></button>
                                            <button onClick={() => onRemoveProduct(p.id)} className="remove-button" aria-label={`Sil: ${p.cins}`}><FaTrash /></button>
                                        </div>
                                    </li>
                                </CSSTransition>
                            );
                        })}
                    </TransitionGroup>
                </div>
            </div>

            <div className="print-button-container">
                 <button onClick={handlePrint} className="print-button"><FaPrint /> ÖNİZLE VE YAZDIR</button>
            </div>
        </div>
    );
};

export default AdminPanel;
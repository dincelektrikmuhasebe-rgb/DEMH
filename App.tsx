import React, { useState, useMemo, useEffect } from 'react';
import QRCode from 'qrcode';
import { Product, SiparisInfo, BulkUpdatePayload } from './types';
import AdminPanel from './components/AdminPanel';
import A4PageComponent from './components/A4PageComponent';
import A4TrapezoidPageComponent from './components/A4TrapezoidPageComponent';
import A4ElipsPageComponent from './components/A4ElipsPageComponent';
import A4YuvarlakCapPageComponent from './components/A4YuvarlakCapPageComponent';
import './App.css';

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const [products, setProducts] = useState<Product[]>([]);
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
    
    const [cariUnvan, setCariUnvan] = useState('');
    const [musteri, setMusteri] = useState('');

    const siparisInfo: SiparisInfo = useMemo(() => {
        const now = new Date();
        const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
        const randomOrderNum = Math.floor(1000 + Math.random() * 9000);
        return {
            tarih: formattedDate,
            siparisNo: `DNC-${now.getFullYear()}${randomOrderNum}`,
            adres: 'Keşan/EDİRNE',
            cariUnvan,
            musteri,
        };
    }, [cariUnvan, musteri]);

    useEffect(() => {
        const generateQrCode = async () => {
            try {
                const url = await QRCode.toDataURL(siparisInfo.siparisNo, {
                    errorCorrectionLevel: 'H',
                    type: 'image/png',
                    quality: 0.9,
                    margin: 1,
                    width: 80,
                });
                setQrCodeDataUrl(url);
            } catch (err) {
                console.error('QR code generation failed:', err);
            }
        };
        generateQrCode();
    }, [siparisInfo.siparisNo]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === '1907') {
            setIsLoggedIn(true);
            setError('');
        } else {
            setError('Hatalı şifre. Lütfen tekrar deneyin.');
        }
    };

    const addProduct = (product: Omit<Product, 'id' | 'm2' | 'isBelowMinM2'>) => {
        const rawM2 = (product.gen / 100) * (product.yuk / 100);
        const isBelow = rawM2 > 0 && rawM2 < 0.25;
        const finalM2 = isBelow ? 0.25 : rawM2;

        const newProduct: Product = {
            ...product,
            id: Date.now(),
            m2: parseFloat(finalM2.toFixed(3)),
            isBelowMinM2: isBelow,
        };
        setProducts(prev => [...prev, newProduct]);
    };
    
    const updateProduct = (id: number, updatedData: Omit<Product, 'id' | 'm2' | 'isBelowMinM2'>) => {
        const rawM2 = (updatedData.gen / 100) * (updatedData.yuk / 100);
        const isBelow = rawM2 > 0 && rawM2 < 0.25;
        const finalM2 = isBelow ? 0.25 : rawM2;

        const updatedProduct: Product = {
            ...updatedData,
            id: id,
            m2: parseFloat(finalM2.toFixed(3)),
            isBelowMinM2: isBelow,
        };
        setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
    };


    const removeProduct = (id: number) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    };
    
    const updateAllProducts = (payload: BulkUpdatePayload) => {
        setProducts(prevProducts =>
            prevProducts.map(p => ({
                ...p,
                cins: payload.cins,
                elips: payload.elips,
                yuvarlakCap: payload.yuvarlakCap,
                delikCapi: payload.delikCapi,
                yamukFarki: undefined,
            }))
        );
    };

    const handlePrint = () => {
        window.print();
    };
    
    const itemsPerPage = 20;

    // Ürünleri kategorilere ayır
    const trapezoidProducts = useMemo(() => products.filter(p => p.yamukFarki && p.yamukFarki > 0), [products]);
    const elipsProducts = useMemo(() => products.filter(p => p.elips), [products]);
    const yuvarlakCapProducts = useMemo(() => products.filter(p => p.yuvarlakCap), [products]);
    const regularProducts = useMemo(() => products.filter(p => (!p.yamukFarki || p.yamukFarki <= 0) && !p.elips && !p.yuvarlakCap), [products]);

    const hasTrapezoidPage = trapezoidProducts.length > 0;
    const hasElipsPage = elipsProducts.length > 0;
    const hasYuvarlakCapPage = yuvarlakCapProducts.length > 0;

    // Standart ürünleri sayfalara böl
    const paginatedRegularProducts = useMemo(() => {
        const pages: Product[][] = [];
        for (let i = 0; i < regularProducts.length; i += itemsPerPage) {
            pages.push(regularProducts.slice(i, i + itemsPerPage));
        }
        if (pages.length === 0 && products.length === 0) { // Hiç ürün yoksa boş bir sayfa oluştur
             pages.push([]);
        }
        return pages;
    }, [regularProducts, products.length]);

    const regularPagesCount = paginatedRegularProducts.filter(p => p.length > 0).length;
    const totalPages = regularPagesCount + (hasTrapezoidPage ? 1 : 0) + (hasElipsPage ? 1 : 0) + (hasYuvarlakCapPage ? 1 : 0);

    const totalAdet = useMemo(() => products.reduce((sum, p) => sum + p.adet, 0), [products]);
    const totalM2 = useMemo(() => products.reduce((sum, p) => sum + p.m2 * p.adet, 0), [products]);


    if (!isLoggedIn) {
        return (
            <div className="login-container">
                <div className="login-card">
                    <h1>DİNÇ CAM</h1>
                    <h2>Sipariş Sistemi</h2>
                    <form onSubmit={handleLogin}>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Şifrenizi Giriniz"
                            aria-label="Şifre"
                        />
                        <button type="submit">GİRİŞ YAP</button>
                        {error && <p className="error-message">{error}</p>}
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="app-container">
            <AdminPanel
                onAddProduct={addProduct}
                products={products}
                onRemoveProduct={removeProduct}
                onUpdateProduct={updateProduct}
                handlePrint={handlePrint}
                onUpdateAllProducts={updateAllProducts}
                cariUnvan={cariUnvan}
                musteri={musteri}
                onCariUnvanChange={setCariUnvan}
                onMusteriChange={setMusteri}
            />
            <div className="preview-container">
                {paginatedRegularProducts.map((pageProducts, index) => (
                    (pageProducts.length > 0 || (index === 0 && products.length === 0)) &&
                    <A4PageComponent
                        key={`page-${index}`}
                        siparisInfo={siparisInfo}
                        products={pageProducts}
                        qrCodeDataUrl={qrCodeDataUrl}
                        totalAdet={totalAdet}
                        totalM2={totalM2}
                        isLastPage={!hasTrapezoidPage && !hasElipsPage && !hasYuvarlakCapPage && index === regularPagesCount - 1}
                        currentPage={index + 1}
                        totalPages={totalPages}
                    />
                ))}
                {hasTrapezoidPage && (
                    <A4TrapezoidPageComponent
                        siparisInfo={siparisInfo}
                        qrCodeDataUrl={qrCodeDataUrl}
                        products={trapezoidProducts}
                        currentPage={regularPagesCount + 1}
                        totalPages={totalPages}
                        totalAdet={totalAdet}
                        totalM2={totalM2}
                        isLastPage={!hasElipsPage && !hasYuvarlakCapPage}
                    />
                )}
                {hasElipsPage && (
                    <A4ElipsPageComponent
                        siparisInfo={siparisInfo}
                        qrCodeDataUrl={qrCodeDataUrl}
                        products={elipsProducts}
                        currentPage={regularPagesCount + (hasTrapezoidPage ? 1 : 0) + 1}
                        totalPages={totalPages}
                        totalAdet={totalAdet}
                        totalM2={totalM2}
                        isLastPage={!hasYuvarlakCapPage}
                    />
                )}
                 {hasYuvarlakCapPage && (
                    <A4YuvarlakCapPageComponent
                        siparisInfo={siparisInfo}
                        qrCodeDataUrl={qrCodeDataUrl}
                        products={yuvarlakCapProducts}
                        currentPage={regularPagesCount + (hasTrapezoidPage ? 1 : 0) + (hasElipsPage ? 1 : 0) + 1}
                        totalPages={totalPages}
                        totalAdet={totalAdet}
                        totalM2={totalM2}
                        isLastPage={true}
                    />
                )}
            </div>
        </div>
    );
};

export default App;
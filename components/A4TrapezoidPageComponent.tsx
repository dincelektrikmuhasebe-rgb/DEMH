import React from 'react';
import { Product, SiparisInfo } from '../types';
import './A4TrapezoidPageComponent.css';

interface A4TrapezoidPageProps {
    siparisInfo: SiparisInfo;
    products: Product[];
    qrCodeDataUrl: string;
    currentPage: number;
    totalPages: number;
    totalAdet: number;
    totalM2: number;
    isLastPage: boolean;
}

const TrapezoidSchema: React.FC<{ product: Product }> = ({ product }) => {
    const svgWidth = 200;
    const svgHeight = 150;
    const padding = 20;
    const yamukFarki = product.yamukFarki || 0;

    const x1 = padding;
    const y1 = svgHeight - padding;
    const x2 = svgWidth - padding;
    const y2 = svgHeight - padding;
    const x3 = svgWidth - padding;
    const y3 = padding;
    // Farkı, genişliğin bir oranı olarak ölçeklendirerek görselleştirmeyi iyileştir
    const scaleFactor = (svgWidth - 2 * padding) / product.gen;
    const x4 = padding + (yamukFarki * scaleFactor);
    const y4 = padding;

    return (
        <div className="schema-wrapper">
            <h4>{product.gen} x {product.yuk} cm - Fark: {yamukFarki} cm ({product.adet} Adet)</h4>
            <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="trapezoid-svg">
                <polygon points={`${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}`} fill="rgba(0, 163, 224, 0.1)" stroke="#005A9C" strokeWidth="1" />
                {/* Ölçüler */}
                <text x={(x1 + x2) / 2} y={y1 + 15} textAnchor="middle" fontSize="12">{product.gen} cm</text>
                <text x={x3 + 5} y={(y2 + y3) / 2} textAnchor="start" fontSize="12" transform={`rotate(90, ${x3+5}, ${(y2+y3)/2})`}>{product.yuk} cm</text>
                 <text x={(x4 + x3) / 2} y={y4 - 8} textAnchor="middle" fontSize="12">{product.gen - yamukFarki} cm</text>
            </svg>
        </div>
    )
}


const A4TrapezoidPageComponent: React.FC<A4TrapezoidPageProps> = ({
    siparisInfo,
    products,
    qrCodeDataUrl,
    currentPage,
    totalPages,
    totalAdet,
    totalM2,
    isLastPage
}) => {
    return (
        <div className="a4-page-container">
            <div className="page-content">
                <header className="a4-header">
                     <div className="logo-container">
                        <h1>DİNÇ CAM</h1>
                        <p>CAM | AYNA | LAMİNE</p>
                        <div className="customer-info">
                            <p><strong>Cari Ünvan:</strong> {siparisInfo.cariUnvan || 'STANDART'}</p>
                            <p><strong>Müşteri:</strong> {siparisInfo.musteri || 'STANDART'}</p>
                        </div>
                    </div>
                    <div className="qr-info-container">
                        <div className="order-info-top">
                           <p><strong>Sipariş No:</strong> {siparisInfo.siparisNo}</p>
                           <p><strong>Tarih:</strong> {siparisInfo.tarih}</p>
                        </div>
                        <div className="qr-info-bottom">
                            <p className="address-info">{siparisInfo.adres}</p>
                            {qrCodeDataUrl && <img src={qrCodeDataUrl} alt="Sipariş QR Kodu" className="qr-code" />}
                        </div>
                    </div>
                </header>

                <main className="a4-main">
                    <h2 className="trapezoid-page-title">Yamuk Kesim Şemaları</h2>
                    <div className="schemas-container">
                        {products.map(p => <TrapezoidSchema key={p.id} product={p} />)}
                    </div>
                </main>

                <footer className="a4-footer">
                   {isLastPage && (
                     <div className="totals-container">
                        <h3>Genel Toplam</h3>
                        <p><strong>Toplam Adet:</strong> {totalAdet}</p>
                        <p><strong>Toplam m²:</strong> {totalM2.toFixed(2)}</p>
                    </div>
                   )}
                    <div className="page-number">
                        Sayfa {currentPage} / {totalPages}
                    </div>
                    <div className="credit-text">
                        Bu program Ahmet Şahinbaş tarafından HTML5 dili kullanılarak yazılmıştır.
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default A4TrapezoidPageComponent;
import React from 'react';
import { Product, SiparisInfo } from '../types';
import './A4YuvarlakCapPageComponent.css';

interface A4YuvarlakCapPageProps {
    siparisInfo: SiparisInfo;
    products: Product[];
    qrCodeDataUrl: string;
    currentPage: number;
    totalPages: number;
    totalAdet: number;
    totalM2: number;
    isLastPage: boolean;
}

const YuvarlakCapSchema: React.FC<{ product: Product }> = ({ product }) => {
    const svgWidth = 200;
    const svgHeight = 200; // Keep it square for a circle
    const padding = 20;

    const cx = svgWidth / 2;
    const cy = svgHeight / 2;
    const r = (svgWidth - 2 * padding) / 2;

    return (
        <div className="schema-wrapper">
            <h4>{product.gen} x {product.yuk} cm ({product.adet} Adet)</h4>
            <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="yuvarlak-cap-svg">
                <circle cx={cx} cy={cy} r={r} fill="rgba(0, 163, 224, 0.1)" stroke="#005A9C" strokeWidth="1" />
                {/* Diameter Line */}
                <line x1={padding} y1={cy} x2={svgWidth - padding} y2={cy} stroke="#333" strokeWidth="1" strokeDasharray="3,3" />
                {/* Dimension Text */}
                <text x={cx} y={cy - 5} textAnchor="middle" fontSize="12">{product.gen} cm</text>
                 {product.gen !== product.yuk && 
                    <>
                      <line x1={cx} y1={padding} x2={cx} y2={svgHeight - padding} stroke="#333" strokeWidth="1" strokeDasharray="3,3" />
                      <text x={cx + 5} y={cy - r/2} textAnchor="start" fontSize="12" transform={`rotate(90, ${cx+5}, ${cy - r/2})`}>{product.yuk} cm</text>
                    </>
                 }
            </svg>
        </div>
    )
}

const A4YuvarlakCapPageComponent: React.FC<A4YuvarlakCapPageProps> = ({
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
                    <h2 className="yuvarlak-cap-page-title">Yuvarlak Çap Kesim Şemaları</h2>
                    <div className="schemas-container">
                        {products.map(p => <YuvarlakCapSchema key={p.id} product={p} />)}
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

export default A4YuvarlakCapPageComponent;
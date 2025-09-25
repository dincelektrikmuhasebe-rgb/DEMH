import React from 'react';
import { Product, SiparisInfo } from '../types';
import './A4ElipsPageComponent.css';

interface A4ElipsPageProps {
    siparisInfo: SiparisInfo;
    products: Product[];
    qrCodeDataUrl: string;
    currentPage: number;
    totalPages: number;
    totalAdet: number;
    totalM2: number;
    isLastPage: boolean;
}

const ElipsSchema: React.FC<{ product: Product }> = ({ product }) => {
    const svgWidth = 200;
    const aspectRatio = product.yuk / product.gen;
    // Maintain aspect ratio, but with min/max height for very thin/tall items
    const svgHeight = Math.max(100, Math.min(250, svgWidth * aspectRatio)); 
    const padding = 20;

    const rectX = padding;
    const rectY = padding;
    const rectWidth = svgWidth - 2 * padding;
    // Adjust rect height based on svgHeight to keep it centered
    const rectHeight = (rectWidth / svgWidth) * (svgHeight - 2 * padding);


    const cx = svgWidth / 2;
    const cy = svgHeight / 2;
    const rx = rectWidth / 2;
    const ry = rectHeight / 2;

    return (
        <div className="schema-wrapper">
            <h4>{product.gen} x {product.yuk} cm ({product.adet} Adet)</h4>
            <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="elips-svg">
                <rect x={rectX} y={rectY} width={rectWidth} height={svgHeight - 2 * padding} fill="none" stroke="#cccccc" strokeDasharray="2,2" />
                <ellipse cx={cx} cy={cy} rx={rx} ry={(svgHeight - 2 * padding)/2} fill="rgba(0, 163, 224, 0.1)" stroke="#005A9C" strokeWidth="1" />
                {/* Dimensions */}
                <text x={svgWidth / 2} y={svgHeight - (padding / 2) + 5} textAnchor="middle" fontSize="12">{product.gen} cm</text>
                <text x={padding / 2 - 5} y={svgHeight / 2} textAnchor="middle" fontSize="12" transform={`rotate(-90, ${padding/2 - 5}, ${svgHeight/2})`}>{product.yuk} cm</text>
            </svg>
        </div>
    )
}

const A4ElipsPageComponent: React.FC<A4ElipsPageProps> = ({
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
                    <h2 className="elips-page-title">Elips Kesim Şemaları</h2>
                    <div className="schemas-container">
                        {products.map(p => <ElipsSchema key={p.id} product={p} />)}
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

export default A4ElipsPageComponent;
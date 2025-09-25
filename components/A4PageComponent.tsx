import React from 'react';
import { Product, SiparisInfo } from '../types';
import './A4PageComponent.css';

interface A4PageProps {
    siparisInfo: SiparisInfo;
    products: Product[];
    qrCodeDataUrl: string;
    totalAdet: number;
    totalM2: number;
    isLastPage: boolean;
    currentPage: number;
    totalPages: number;
}

const A4PageComponent: React.FC<A4PageProps> = ({
    siparisInfo,
    products,
    qrCodeDataUrl,
    totalAdet,
    totalM2,
    isLastPage,
    currentPage,
    totalPages,
}) => {
    
    const formatCins = (cins: string) => {
        const parts = cins.split(/( - BACA| - MENFEZ)/g);
        return (
            <>
                {parts.map((part, index) => {
                    if (part === ' - BACA' || part === ' - MENFEZ') {
                        return <strong key={index}>{part}</strong>;
                    }
                    return part;
                })}
            </>
        );
    };

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
                    <div className="product-table-print-wrapper">
                        <table className="product-table">
                            <thead>
                                <tr>
                                    <th>Cins</th>
                                    <th>Genişlik (m)</th>
                                    <th>Yükseklik (m)</th>
                                    <th>Adet</th>
                                    <th>m²</th>
                                    <th>Toplam m²</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((p) => (
                                    <tr key={p.id} className={p.isBelowMinM2 ? 'min-m2-row' : ''}>
                                        <td>{formatCins(p.cins)}</td>
                                        <td>{(p.gen / 100).toFixed(2).replace('.', ',')}</td>
                                        <td>{(p.yuk / 100).toFixed(2).replace('.', ',')}</td>
                                        <td>{p.adet}</td>
                                        <td>{p.m2.toFixed(2)}</td>
                                        <td>{(p.m2 * p.adet).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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

export default A4PageComponent;
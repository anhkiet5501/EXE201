import React, { useEffect, useState } from 'react';
import { proService } from '../../services/modules/proService';
import { getApiErrorMessage } from '../../services/api/mockConfig';
import { useProStatus } from '../../hooks/useProStatus';
import ProLockedCard from './ProLockedCard';

const barColor = (pct) => (pct >= 80 ? '#22C55E' : pct >= 60 ? '#F59E0B' : '#EF4444');

/** Báo cáo rủi ro an toàn 30 ngày. Free: thẻ giới thiệu. Pro: dữ liệu thật từ Backend. */
export default function ProRiskReportCard() {
  const { isPro } = useProStatus();
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(isPro);

  useEffect(() => {
    if (!isPro) return undefined;
    let cancelled = false;
    proService
      .getRiskReport()
      .then((res) => {
        if (!cancelled) setReport(res?.data || res);
      })
      .catch((err) => {
        if (!cancelled) setError(getApiErrorMessage(err, 'Không tải được báo cáo rủi ro.'));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isPro]);

  if (!isPro) {
    return (
      <ProLockedCard
        icon="📊"
        title="Báo cáo rủi ro an toàn"
        description="Mimo phân tích 30 ngày học của bạn để chỉ ra chủ đề bạn hay mắc lỗi và những tình huống cần luyện lại."
        bullets={['Độ chính xác theo từng chủ đề', 'Top 5 câu sai nhiều nhất', 'Xu hướng chính xác 7 ngày', 'Gợi ý chủ đề cần ưu tiên']}
      />
    );
  }

  const maxDaily = report ? Math.max(1, ...report.daily.map((d) => d.total)) : 1;

  return (
    <div style={{ background: '#FFFFFF', border: '2px solid #FDE68A', borderRadius: '24px', padding: '24px 26px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
        <span style={{ fontSize: '26px' }}>📊</span>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#0F172A' }}>
          Báo cáo rủi ro an toàn <span style={{ color: '#B45309' }}>👑 Pro</span>
        </h3>
      </div>
      <div style={{ fontSize: '12.5px', color: '#64748B', marginBottom: '16px' }}>
        Dữ liệu {report?.periodDays || 30} ngày gần nhất
      </div>

      {loading && <div style={{ color: '#64748B', fontSize: '14px' }}>⏳ Đang phân tích dữ liệu học của bạn...</div>}
      {error && <div style={{ color: '#B91C1C', fontSize: '13.5px' }}>⚠️ {error}</div>}

      {report && (
        <>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {[
              { label: 'Độ chính xác', value: `${report.accuracyPercent}%`, color: barColor(report.accuracyPercent) },
              { label: 'Câu đã trả lời', value: report.totalAnswers, color: '#0284C7' },
              { label: 'Câu trả lời sai', value: report.totalAnswers - report.correctAnswers, color: '#EF4444' },
            ].map((s) => (
              <div key={s.label} style={{ flex: '1 1 120px', background: '#F8FAFC', borderRadius: '14px', padding: '12px 14px' }}>
                <div style={{ fontSize: '24px', fontWeight: 900, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div
            style={{
              background: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderRadius: '14px',
              padding: '12px 14px',
              fontSize: '13.5px',
              color: '#78350F',
              marginBottom: '16px',
            }}
          >
            🎯 {report.focusMessage}
          </div>

          {report.domains.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '8px' }}>
                Độ chính xác theo chủ đề
              </div>
              {report.domains.map((d) => (
                <div key={d.domainId} style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: '#475569', fontWeight: 700 }}>
                    <span>{d.domainName}</span>
                    <span>
                      {d.accuracyPercent}% ({d.wrongAnswers} sai / {d.totalAnswers})
                    </span>
                  </div>
                  <div style={{ height: '8px', borderRadius: '999px', background: '#E2E8F0', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${d.accuracyPercent}%`,
                        height: '100%',
                        background: barColor(d.accuracyPercent),
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '8px' }}>Xu hướng 7 ngày</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '70px' }}>
              {report.daily.map((d) => {
                const h = Math.round((d.total / maxDaily) * 54);
                const pct = d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0;
                return (
                  <div key={d.date} style={{ flex: 1, textAlign: 'center' }} title={`${d.date}: ${d.correct}/${d.total} đúng`}>
                    <div
                      style={{
                        height: `${Math.max(d.total > 0 ? 6 : 2, h)}px`,
                        background: d.total > 0 ? barColor(pct) : '#E2E8F0',
                        borderRadius: '6px',
                      }}
                    />
                    <div style={{ fontSize: '10.5px', color: '#94A3B8', marginTop: '3px' }}>{d.date.slice(8)}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {report.weakQuestions.length > 0 && (
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '8px' }}>
                Tình huống bạn hay sai nhất
              </div>
              {report.weakQuestions.map((w) => (
                <div
                  key={w.questionId}
                  style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '13px', padding: '7px 0', borderBottom: '1px solid #F1F5F9' }}
                >
                  <span style={{ background: '#FEE2E2', color: '#B91C1C', fontWeight: 800, borderRadius: '8px', padding: '2px 8px', fontSize: '12px' }}>
                    ×{w.timesWrong}
                  </span>
                  <span style={{ flex: 1, color: '#0F172A' }}>{w.title}</span>
                  {w.domainName && <span style={{ color: '#94A3B8', fontSize: '11.5px' }}>{w.domainName}</span>}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

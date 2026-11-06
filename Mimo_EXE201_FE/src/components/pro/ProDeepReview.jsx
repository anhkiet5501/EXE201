import React, { useEffect, useState } from 'react';
import { proService } from '../../services/modules/proService';
import { getApiErrorMessage } from '../../services/api/mockConfig';
import { useProStatus } from '../../hooks/useProStatus';
import { sound } from '../../utils/audioEffects';
import ProLockedCard from './ProLockedCard';

/**
 * Ôn tập chuyên sâu (Mimo Pro): luyện lại mọi câu từng làm sai, kể cả câu đã giải quyết ở phòng ôn thường.
 * Chấm điểm 100% ở Backend. Không trừ tim, không cộng XP.
 */
export default function ProDeepReview() {
  const { isPro } = useProStatus();
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(isPro);
  const [error, setError] = useState('');

  const [selected, setSelected] = useState(null); // option id | flag id
  const [sequence, setSequence] = useState([]); // id các bước đã chọn theo thứ tự
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);
  const [reviewed, setReviewed] = useState({ total: 0, correct: 0 });

  useEffect(() => {
    if (!isPro) return undefined;
    let cancelled = false;
    proService
      .getDeepReview()
      .then((res) => {
        if (!cancelled) setQuestions(res?.data || res || []);
      })
      .catch((err) => {
        if (!cancelled) setError(getApiErrorMessage(err, 'Không tải được danh sách ôn tập.'));
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
        icon="🎯"
        title="Ôn tập chuyên sâu"
        description="Luyện lại mọi tình huống bạn từng làm sai (kể cả câu đã giải quyết), kèm giải thích chuyên môn. Luyện thoải mái: không tốn tim, không giới hạn lượt."
        bullets={['Ưu tiên câu bạn sai nhiều nhất', 'Giải thích và nguồn tham chiếu sau mỗi câu', 'Không tốn tim, không giới hạn lượt']}
      />
    );
  }

  if (loading) return <div style={{ padding: '30px', textAlign: 'center', color: '#64748B' }}>⏳ Đang tải các câu cần ôn...</div>;
  if (error) return <div style={{ padding: '16px', color: '#B91C1C', background: '#FEF2F2', borderRadius: '12px' }}>⚠️ {error}</div>;
  if (questions.length === 0) {
    return (
      <div style={{ padding: '36px', textAlign: 'center', background: '#F0FDF4', border: '2px solid #BBF7D0', borderRadius: '20px' }}>
        <div style={{ fontSize: '40px' }}>🏆</div>
        <div style={{ fontWeight: 900, fontSize: '18px', color: '#166534', marginTop: '6px' }}>Bạn chưa có câu nào làm sai!</div>
        <div style={{ color: '#15803D', fontSize: '14px', marginTop: '4px' }}>Hãy học thêm vài bài, các câu sai sẽ xuất hiện ở đây để ôn chuyên sâu.</div>
      </div>
    );
  }

  const q = questions[index % questions.length];
  const payload = q.payload || {};
  const type = (q.type || '').toLowerCase();
  const isChoice = type === 'choice' || type === 'scenario_choice';
  const isSequence = type === 'sequence' || type === 'sequencing' || type === 'sequencing_steps';
  const isFlag = type === 'red_flag' || type === 'redflag' || type === 'spot_red_flag';

  const options = payload.options || [];
  const steps = payload.items || [];
  const flags = payload.flags || [];

  const ready = isChoice ? !!selected : isSequence ? sequence.length === steps.length && steps.length > 0 : isFlag ? !!selected : false;

  const handleCheck = async () => {
    if (!ready || checking) return;
    setChecking(true);
    setError('');
    const submittedAnswer = isChoice
      ? { selectedOptionId: selected }
      : isSequence
      ? { orderedItemIds: sequence }
      : { selectedFlagId: selected };
    try {
      const res = await proService.answerDeepReview({ questionId: q.questionId, submittedAnswer });
      const data = res?.data || res;
      setResult(data);
      setReviewed((r) => ({ total: r.total + 1, correct: r.correct + (data.isCorrect ? 1 : 0) }));
      if (data.isCorrect) sound.playCorrect();
      else sound.playWrong();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Không gửi được đáp án. Vui lòng thử lại.'));
    } finally {
      setChecking(false);
    }
  };

  const handleNext = () => {
    sound.playClick();
    setSelected(null);
    setSequence([]);
    setResult(null);
    setError('');
    setIndex((i) => i + 1);
  };

  const choiceStyle = (active) => ({
    textAlign: 'left',
    padding: '14px 16px',
    borderRadius: '14px',
    border: `2px solid ${active ? '#F59E0B' : '#E2E8F0'}`,
    background: active ? '#FFFBEB' : '#FFFFFF',
    fontSize: '14.5px',
    fontWeight: 600,
    color: '#0F172A',
    cursor: result ? 'default' : 'pointer',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
          border: '1px solid #FDE68A',
          borderRadius: '14px',
          padding: '10px 14px',
          fontSize: '13px',
          color: '#78350F',
          fontWeight: 700,
        }}
      >
        <span>👑 Ôn tập chuyên sâu • Câu {(index % questions.length) + 1}/{questions.length}</span>
        <span>
          Đã ôn: {reviewed.correct}/{reviewed.total} đúng
        </span>
      </div>

      <div style={{ background: '#FFFFFF', border: '2px solid #E2E8F0', borderRadius: '20px', padding: '22px' }}>
        <div style={{ fontSize: '12px', fontWeight: 800, color: '#EF4444', marginBottom: '6px' }}>
          Bạn đã sai câu này {q.timesWrong} lần
        </div>
        <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 900, color: '#0F172A' }}>{payload.question || q.title}</h3>
        {payload.scenario && <p style={{ margin: '0 0 14px 0', fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>{payload.scenario}</p>}
        {q.imageUrl && <img src={q.imageUrl} alt="" style={{ maxWidth: '100%', borderRadius: '12px', marginBottom: '12px' }} />}

        {isChoice && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {options.map((o) => (
              <button key={o.id} disabled={!!result} onClick={() => setSelected(o.id)} style={choiceStyle(selected === o.id)}>
                {o.text}
              </button>
            ))}
          </div>
        )}

        {isFlag && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {payload.smsHeader && <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700 }}>{payload.smsHeader}</div>}
            {flags.map((f) => (
              <button key={f.id} disabled={!!result} onClick={() => setSelected(f.id)} style={choiceStyle(selected === f.id)}>
                {f.text}
              </button>
            ))}
          </div>
        )}

        {isSequence && (
          <div>
            <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '8px' }}>Chạm lần lượt các bước theo đúng thứ tự:</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {steps.map((s) => {
                const pos = sequence.indexOf(s.id);
                return (
                  <button
                    key={s.id}
                    disabled={!!result || pos >= 0}
                    onClick={() => setSequence((prev) => [...prev, s.id])}
                    style={{ ...choiceStyle(pos >= 0), opacity: pos >= 0 ? 0.7 : 1 }}
                  >
                    {pos >= 0 ? `${pos + 1}. ` : ''}
                    {s.text}
                  </button>
                );
              })}
            </div>
            {!result && sequence.length > 0 && (
              <button onClick={() => setSequence([])} style={{ marginTop: '8px', background: 'none', border: 'none', color: '#0284C7', fontWeight: 700, cursor: 'pointer' }}>
                ↺ Chọn lại
              </button>
            )}
          </div>
        )}

        {error && <div style={{ marginTop: '12px', color: '#B91C1C', fontSize: '13px' }}>⚠️ {error}</div>}

        {result && (
          <div
            style={{
              marginTop: '16px',
              padding: '14px 16px',
              borderRadius: '14px',
              background: result.isCorrect ? '#F0FDF4' : '#FEF2F2',
              border: `1px solid ${result.isCorrect ? '#BBF7D0' : '#FECACA'}`,
            }}
          >
            <div style={{ fontWeight: 900, color: result.isCorrect ? '#15803D' : '#B91C1C', marginBottom: '4px' }}>
              {result.isCorrect ? '✅ Chính xác!' : '⚠️ Chưa đúng, hãy đọc giải thích nhé'}
            </div>
            <div style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.5 }}>{result.explanation}</div>
            {result.source && <div style={{ fontSize: '12px', color: '#64748B', marginTop: '6px' }}>Nguồn: {result.source}</div>}
          </div>
        )}

        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          {!result ? (
            <button
              disabled={!ready || checking}
              onClick={handleCheck}
              className={`btn-3d ${ready && !checking ? 'btn-3d-green' : 'btn-3d-disabled'} btn-3d-lg`}
            >
              {checking ? 'ĐANG CHẤM...' : 'KIỂM TRA'}
            </button>
          ) : (
            <button onClick={handleNext} className="btn-3d btn-3d-green btn-3d-lg">
              CÂU TIẾP THEO ➔
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

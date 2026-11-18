import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import TreatmentInfo from './components/TreatmentIfo'
import MedicalCardCenter from './components/MedicalCardCenter'
import Layout from '@/components/Layout/Layout'
import useAppStore from '@/store/useAppStore'


const  TreatmentHospital = () => {
  const { treatment_id } = useParams();
  const { setTreatment } = useAppStore();
  // Rendered from local state so a previously viewed treatment never flashes;
  // the store copy is kept in sync for the booking flow.
  const [treatment, setLocalTreatment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // null | "notfound" | "failed"

  useEffect(() => {
    let cancelled = false;
    const fetchTreatment = async () => {
      try {
        setLoading(true);
        setError(null);
        setLocalTreatment(null);
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/treatments/${treatment_id}`,
          { withCredentials: true }
        );
        if (cancelled) return;
        setLocalTreatment(res.data);
        setTreatment(res.data);
      } catch (err) {
        console.error("Failed to fetch treatment:", err);
        if (!cancelled) setError(err?.response?.status === 404 ? "notfound" : "failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchTreatment();
    return () => {
      cancelled = true;
    };
  }, [treatment_id, setTreatment]);

  return (
    <div>
        <Layout>
        <div className='mt-28'>

        </div>
        <TreatmentInfo treatment={treatment} loading={loading} error={error} />

        {!loading && !error && treatment && (
          <MedicalCardCenter treatment={treatment} />
        )}
        </Layout>
    </div>
  )
}

export default TreatmentHospital

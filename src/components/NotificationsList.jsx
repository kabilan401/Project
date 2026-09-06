import React, { useState, useEffect } from "react";
import { Search, Calendar, Briefcase, Award, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";

export default function NotificationsList({ showToast, user }) {
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEligible, setFilterEligible] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState({});

  // Fetch student info (default values if missing)
  const studentCgpa = user?.cgpa !== undefined ? user.cgpa : 8.0;
  const studentBranch = user?.department || "Computer Science";
  const studentYear = user?.year || "4th Year";

  useEffect(() => {
    // Load notifications from local storage
    const stored = localStorage.getItem("prep_notifications");
    if (stored) {
      setNotifications(JSON.parse(stored));
    }

    // Load applied jobs
    const storedApplied = localStorage.getItem("prep_applied_jobs");
    if (storedApplied) {
      setAppliedJobs(JSON.parse(storedApplied));
    }
  }, []);

  // Helper to validate eligibility
  const checkEligibility = (job) => {
    const cgpaOk = studentCgpa >= job.eligibility.cgpa;
    const branchOk = job.eligibility.branches.includes(studentBranch);
    const yearOk = job.eligibility.years.includes(studentYear);
    
    const reasons = [];
    if (!cgpaOk) reasons.push(`Requires CGPA >= ${job.eligibility.cgpa} (Your CGPA: ${studentCgpa.toFixed(2)})`);
    if (!branchOk) reasons.push(`Eligible branches: ${job.eligibility.branches.join(", ")} (Your Branch: ${studentBranch})`);
    if (!yearOk) reasons.push(`Eligible years: ${job.eligibility.years.join(", ")} (Your Year: ${studentYear})`);

    return {
      eligible: cgpaOk && branchOk && yearOk,
      reasons
    };
  };

  // Handle Apply Drive
  const handleApply = (jobId, companyName, roleName) => {
    const updated = {
      ...appliedJobs,
      [jobId]: new Date().toLocaleDateString()
    };
    setAppliedJobs(updated);
    localStorage.setItem("prep_applied_jobs", JSON.stringify(updated));
    showToast(`Successfully registered for ${companyName} - ${roleName}!`, "success");
  };

  // Filtered Notifications List
  const filteredList = notifications.filter(job => {
    const matchesSearch = 
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterEligible) {
      const { eligible } = checkEligibility(job);
      return eligible;
    }

    return true;
  });

  return (
    <div style={styles.container} className="animate-slide-up">
      {/* HEADER ROW */}
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.pageTitle}>Campus Placement Drives</h2>
          <p style={styles.pageSubtitle}>Apply for active recruitment drives and check eligibility in real-time.</p>
        </div>
      </div>

      {/* STUDENT PROFILE CARD */}
      <div className="glass-panel" style={styles.studentMetricsCard}>
        <div style={styles.metricsWrapper}>
          <div style={styles.metricItem}>
            <span style={styles.metricLabel}>Your CGPA</span>
            <span style={styles.metricValue}>{studentCgpa.toFixed(2)}</span>
          </div>
          <div style={styles.metricSeparator} />
          <div style={styles.metricItem}>
            <span style={styles.metricLabel}>Branch / Department</span>
            <span style={styles.metricValue}>{studentBranch}</span>
          </div>
          <div style={styles.metricSeparator} />
          <div style={styles.metricItem}>
            <span style={styles.metricLabel}>Academic Year</span>
            <span style={styles.metricValue}>{studentYear}</span>
          </div>
        </div>
        <p style={styles.metricFooter}>
          Note: To update CGPA or department, edit your credentials in the <strong>Profile Workspace</strong> tab.
        </p>
      </div>

      {/* SEARCH AND FILTERS */}
      <div style={styles.filterRow}>
        <div style={styles.searchContainer}>
          <Search size={18} style={styles.searchIcon} />
          <input
            type="text"
            className="input-field"
            placeholder="Search by company or role..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <button
          className={`btn ${filterEligible ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setFilterEligible(!filterEligible)}
          style={styles.filterBtn}
        >
          {filterEligible ? "Showing Eligible Only" : "Filter: Eligible Only"}
        </button>
      </div>

      {/* JOBS LIST GRID */}
      <div style={styles.jobsList}>
        {filteredList.map(job => {
          const { eligible, reasons } = checkEligibility(job);
          const isApplied = !!appliedJobs[job.id];

          return (
            <div className="glass-panel" key={job.id} style={styles.jobCard}>
              <div style={styles.jobCardHeader}>
                <div>
                  <h3 style={styles.jobTitle}>{job.role}</h3>
                  <h4 style={styles.companyName}>{job.company}</h4>
                </div>
                <div style={styles.packageBadgeContainer}>
                  <span className="badge" style={styles.packageBadge}>
                    <Award size={14} /> {job.package}
                  </span>
                </div>
              </div>

              <div style={styles.jobTimeline}>
                <div style={styles.timelineItem}>
                  <Calendar size={14} color="var(--text-secondary)" />
                  <span>Drive Date: <strong>{new Date(job.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</strong></span>
                </div>
                <div style={styles.timelineItem}>
                  <Briefcase size={14} color="var(--text-secondary)" />
                  <span>Branches: {job.eligibility.branches.join(", ")}</span>
                </div>
              </div>

              <p style={styles.jobDesc}>{job.description}</p>

              {/* ELIGIBILITY BLOCK */}
              <div style={styles.eligibilityBlock(eligible)}>
                <div style={styles.eligibilityHeader}>
                  {eligible ? (
                    <div style={styles.eligibleText}>
                      <CheckCircle2 size={16} color="var(--accent-emerald)" />
                      <span>You are Eligible to apply</span>
                    </div>
                  ) : (
                    <div style={styles.ineligibleText}>
                      <AlertCircle size={16} color="var(--accent-rose)" />
                      <span>You are not eligible for this drive</span>
                    </div>
                  )}
                </div>
                {!eligible && (
                  <ul style={styles.reasonsList}>
                    {reasons.map((reason, i) => (
                      <li key={i} style={styles.reasonItem}>{reason}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* ACTION FOOTER */}
              <div style={styles.cardFooter}>
                {job.link && (
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={styles.linkBtn}
                  >
                    Details <ExternalLink size={14} />
                  </a>
                )}
                {isApplied ? (
                  <button className="btn btn-secondary" style={styles.appliedBtn} disabled>
                    <CheckCircle2 size={16} color="var(--accent-emerald)" /> Applied ({appliedJobs[job.id]})
                  </button>
                ) : (
                  <button
                    className={`btn ${eligible ? "btn-primary" : "btn-secondary"}`}
                    style={eligible ? styles.applyBtn : styles.disabledBtn}
                    disabled={!eligible}
                    onClick={() => handleApply(job.id, job.company, job.role)}
                  >
                    {eligible ? "Apply Drive" : "Locked"}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredList.length === 0 && (
          <div className="glass-panel" style={styles.emptyCard}>
            <Briefcase size={48} color="var(--text-secondary)" style={{ marginBottom: 16 }} />
            <h3 style={styles.emptyTitle}>No recruitment drives found</h3>
            <p style={styles.emptySubtitle}>Try adjusting your search filters or check back later for new openings.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px 0",
    maxWidth: "1000px",
    margin: "0 auto",
    textAlign: "left"
  },
  pageTitle: {
    fontSize: "1.8rem",
    fontWeight: 800,
    background: "var(--brand-gradient)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "8px"
  },
  pageSubtitle: {
    color: "var(--text-secondary)",
    fontSize: "1rem",
    marginBottom: "28px"
  },
  studentMetricsCard: {
    padding: "20px 24px",
    marginBottom: "24px"
  },
  metricsWrapper: {
    display: "flex",
    gap: "32px",
    alignItems: "center",
    flexWrap: "wrap"
  },
  metricItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },
  metricLabel: {
    fontSize: "0.75rem",
    textTransform: "uppercase",
    color: "var(--text-secondary)",
    fontWeight: 600,
    letterSpacing: "0.05em"
  },
  metricValue: {
    fontSize: "1.2rem",
    fontWeight: 800,
    color: "var(--text-primary)"
  },
  metricSeparator: {
    width: "1px",
    height: "36px",
    backgroundColor: "var(--border-color)"
  },
  metricFooter: {
    fontSize: "0.8rem",
    color: "var(--text-secondary)",
    marginTop: "14px",
    borderTop: "1px solid var(--border-color)",
    paddingTop: "10px"
  },
  filterRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    marginBottom: "28px"
  },
  searchContainer: {
    position: "relative",
    flex: 1
  },
  searchIcon: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "var(--text-secondary)"
  },
  searchInput: {
    paddingLeft: "42px"
  },
  filterBtn: {
    padding: "12px 20px"
  },
  jobsList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  jobCard: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  jobCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottom: "1px solid var(--border-color)",
    paddingBottom: "14px"
  },
  jobTitle: {
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "var(--text-primary)"
  },
  companyName: {
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "var(--brand-accent)",
    marginTop: "4px"
  },
  packageBadgeContainer: {
    alignSelf: "center"
  },
  packageBadge: {
    fontSize: "0.85rem",
    padding: "6px 12px",
    borderRadius: "12px",
    fontWeight: 600
  },
  jobTimeline: {
    display: "flex",
    gap: "24px",
    flexWrap: "wrap",
    fontSize: "0.88rem",
    color: "var(--text-secondary)"
  },
  timelineItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  jobDesc: {
    fontSize: "0.92rem",
    lineHeight: "1.6",
    color: "var(--text-primary)"
  },
  eligibilityBlock: (eligible) => ({
    padding: "12px 16px",
    borderRadius: "8px",
    background: eligible ? "rgba(16, 185, 129, 0.05)" : "rgba(244, 63, 94, 0.05)",
    border: eligible ? "1px solid rgba(16, 185, 129, 0.15)" : "1px solid rgba(244, 63, 94, 0.15)"
  }),
  eligibilityHeader: {
    display: "flex",
    alignItems: "center",
    fontSize: "0.88rem",
    fontWeight: 600
  },
  eligibleText: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "var(--accent-emerald)"
  },
  ineligibleText: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "var(--accent-rose)"
  },
  reasonsList: {
    marginTop: "8px",
    paddingLeft: "24px",
    fontSize: "0.82rem",
    color: "var(--text-secondary)",
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },
  reasonItem: {
    listStyleType: "disc"
  },
  cardFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "8px"
  },
  linkBtn: {
    padding: "10px 16px"
  },
  applyBtn: {
    padding: "10px 24px"
  },
  appliedBtn: {
    padding: "10px 24px",
    background: "rgba(16, 185, 129, 0.1)",
    border: "1px solid rgba(16, 185, 129, 0.2)",
    color: "var(--accent-emerald)",
    cursor: "default"
  },
  disabledBtn: {
    padding: "10px 24px",
    opacity: 0.5,
    cursor: "not-allowed"
  },
  emptyCard: {
    padding: "48px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  emptyTitle: {
    fontSize: "1.2rem",
    fontWeight: 700,
    marginBottom: "6px"
  },
  emptySubtitle: {
    color: "var(--text-secondary)",
    fontSize: "0.9rem",
    maxWidth: "400px"
  }
};

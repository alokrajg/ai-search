"""
APScheduler configuration for automated query running and aggregation.
"""

import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
from apscheduler.jobstores.memory import MemoryJobStore
from apscheduler.executors.asyncio import AsyncIOExecutor
from datetime import datetime, timedelta
import asyncio

from .query_runner import QueryRunner
from .aggregator import VisibilityAggregator

logger = logging.getLogger(__name__)

# Global scheduler instance
scheduler = None

def start_scheduler():
    """Start the APScheduler with configured jobs."""
    global scheduler
    
    if scheduler is not None:
        logger.warning("Scheduler already running")
        return
    
    # Configure job stores and executors
    jobstores = {
        'default': MemoryJobStore()
    }
    
    executors = {
        'default': AsyncIOExecutor()
    }
    
    job_defaults = {
        'coalesce': True,
        'max_instances': 1,
        'misfire_grace_time': 300  # 5 minutes
    }
    
    # Create scheduler
    scheduler = AsyncIOScheduler(
        jobstores=jobstores,
        executors=executors,
        job_defaults=job_defaults,
        timezone='UTC'
    )
    
    # Add jobs
    _add_query_runner_job()
    _add_aggregation_job()
    _add_cleanup_job()
    
    # Start scheduler
    scheduler.start()
    logger.info("✅ Scheduler started successfully")

def stop_scheduler():
    """Stop the APScheduler."""
    global scheduler
    
    if scheduler is not None:
        scheduler.shutdown()
        scheduler = None
        logger.info("✅ Scheduler stopped successfully")

def _add_query_runner_job():
    """Add the query runner job to scheduler."""
    if scheduler is None:
        return
    
    # DISABLED: Run every 2 hours (reduced frequency to save costs)
    # scheduler.add_job(
    #     func=run_query_job,
    #     trigger=IntervalTrigger(hours=2),
    #     id='query_runner',
    #     name='Query Runner - Run brand queries against AI engines',
    #     replace_existing=True
    # )
    
    logger.info("📅 Query runner job DISABLED to prevent unexpected API costs")

def _add_aggregation_job():
    """Add the aggregation job to scheduler."""
    if scheduler is None:
        return
    
    # Run daily at 2 AM UTC
    scheduler.add_job(
        func=run_aggregation_job,
        trigger=CronTrigger(hour=2, minute=0),
        id='aggregation',
        name='Visibility Aggregation - Compute daily metrics',
        replace_existing=True
    )
    
    logger.info("📅 Added aggregation job (daily at 2 AM UTC)")

def _add_cleanup_job():
    """Add the cleanup job to scheduler."""
    if scheduler is None:
        return
    
    # Run weekly on Sunday at 3 AM UTC
    scheduler.add_job(
        func=run_cleanup_job,
        trigger=CronTrigger(day_of_week=0, hour=3, minute=0),
        id='cleanup',
        name='Data Cleanup - Remove old data',
        replace_existing=True
    )
    
    logger.info("📅 Added cleanup job (weekly on Sunday at 3 AM UTC)")

async def run_query_job():
    """Execute the query runner job."""
    try:
        logger.info("🚀 Starting query runner job")
        
        runner = QueryRunner()
        result = await runner.run_all_queries()
        
        logger.info(f"✅ Query runner job completed: {result}")
        
    except Exception as e:
        logger.error(f"❌ Query runner job failed: {e}")

async def run_aggregation_job():
    """Execute the aggregation job."""
    try:
        logger.info("🚀 Starting aggregation job")
        
        aggregator = VisibilityAggregator()
        result = await aggregator.aggregate_all_brands()
        
        logger.info(f"✅ Aggregation job completed: {result}")
        
    except Exception as e:
        logger.error(f"❌ Aggregation job failed: {e}")

async def run_cleanup_job():
    """Execute the cleanup job."""
    try:
        logger.info("🚀 Starting cleanup job")
        
        # Clean up old runs (older than 30 days)
        cutoff_date = datetime.now() - timedelta(days=30)
        
        # This would be implemented in the database module
        # await cleanup_old_runs(cutoff_date)
        
        logger.info("✅ Cleanup job completed")
        
    except Exception as e:
        logger.error(f"❌ Cleanup job failed: {e}")

def get_scheduler_status():
    """Get current scheduler status and job information."""
    if scheduler is None:
        return {"status": "stopped", "jobs": []}
    
    jobs = []
    for job in scheduler.get_jobs():
        jobs.append({
            "id": job.id,
            "name": job.name,
            "next_run": job.next_run_time.isoformat() if job.next_run_time else None,
            "trigger": str(job.trigger)
        })
    
    return {
        "status": "running",
        "jobs": jobs
    }

def trigger_job_manually(job_id: str):
    """Manually trigger a specific job."""
    if scheduler is None:
        raise Exception("Scheduler not running")
    
    job = scheduler.get_job(job_id)
    if job is None:
        raise Exception(f"Job {job_id} not found")
    
    # Run the job in the background
    asyncio.create_task(job.func())
    return f"Job {job_id} triggered manually"
